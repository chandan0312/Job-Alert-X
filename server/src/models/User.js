// ---------------------------------------------------------------------------
// User — accounts for both regular users and admin write routes.
// ---------------------------------------------------------------------------
// Plaintext passwords are never stored or returned. Assign to the virtual
// `password` field and a `beforeSave` hook writes the bcrypt hash instead.
//
// Google OAuth users may have no password — `passwordHash` is nullable for
// these accounts. The `verifyPassword` method handles this gracefully.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 10

export const USER_ROLES = ['admin', 'editor', 'user']

export default function defineUser(sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(190), // 190 keeps the UNIQUE index inside utf8mb4 limits
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('email', String(value || '').trim().toLowerCase())
        },
        validate: {
          isEmail: { msg: 'A valid email address is required' },
        },
      },
      name: DataTypes.STRING(120),
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
        defaultValue: 'user',
      },
      passwordHash: {
        type: DataTypes.STRING(100),
        allowNull: true, // nullable for Google-only accounts
      },

      // Google OAuth fields
      googleId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      // Write-only convenience field — never persisted as a column.
      password: {
        type: DataTypes.VIRTUAL,
        validate: {
          len: {
            args: [8, 128],
            msg: 'Password must be at least 8 characters long',
          },
        },
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      hooks: {
        // Must be beforeValidate, not beforeSave: Sequelize validates *before*
        // save hooks run, so hashing later would trip the `passwordHash`
        // notNull check on every insert.
        async beforeValidate(user) {
          const plain = user.get('password')
          if (plain) {
            user.set('passwordHash', await bcrypt.hash(plain, BCRYPT_ROUNDS))
          }
        },
        // The plaintext is left in place through validation (so the length rule
        // still sees it) and only discarded once the row is safely written.
        afterSave(user) {
          user.set('password', undefined)
        },
      },
    }
  )

  /** Constant-time comparison of a candidate password against the stored hash. */
  User.prototype.verifyPassword = function verifyPassword(candidate) {
    if (!candidate || !this.passwordHash) return Promise.resolve(false)
    return bcrypt.compare(candidate, this.passwordHash)
  }

  /** Belt-and-braces: the hash can never leak through `res.json(user)`. */
  User.prototype.toJSON = function toJSON() {
    const { passwordHash, password, ...safe } = this.get({ plain: true })
    return safe
  }

  return User
}
