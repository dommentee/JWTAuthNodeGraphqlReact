import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import {hash} from 'bcryptjs'
import { User } from './entity/User';

@Resolver()
export class UserResolver {// graphql schema goes in here
  @Query( () => String)//type
  hello() {
    return 'hi!'
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,// name of gql schema and type
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12)//promise neeed await
    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (error) {
      console.log(error)
      return false
    }
    return true
  }
}