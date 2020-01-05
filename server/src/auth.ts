import { User } from './entity/User';
import {sign} from 'jsonwebtoken'

export const CreateAccessToken = (user: User) => {
  return sign({ userId: user.id }, 'retgasutkalw', { expiresIn: '15m' })
  
}

export const CreateRefreshToken = (user: User) => {
  return sign({ userId: user.id }, 'dfdaesdef', {
    expiresIn: '7d'
  })
}