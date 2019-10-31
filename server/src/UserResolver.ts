import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import {hash, compare} from 'bcryptjs'
import { User } from './entity/User';

@Resolver()
export class UserResolver {// graphql schema goes in here
  @Query( () => String)//type
  hello() {
    return 'hi!'
  }

  @Query(() => [User])// query that finds all (users)
  users() {
    return User.find();
  }

  //register mutation/resolver
  @Mutation(() => Boolean)// mutations is what we want changable in the database
  async register(
    @Arg('email') email: string,// name of gql schema and type arguments
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12)//promise neeed await hashpasswrord
    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (error) {
      console.log(error)
      return false
    }
    return true; // it word
  }

  //login mutation/resolver
  @Mutation(() => Boolean)// mutations is what we want changable in the database
  async login(
    @Arg('email') email: string,// name of gql schema and type arguments
    @Arg('password') password: string,
  ) {
    const user = await User.findOne({ where: { email } });// search to see if email matches email
    //if no user
    if (!user) {
      throw new Error('invalid login')
    }

    //compare passwords// import compare from b crypt
    const valid = compare(password, user.password)

    //if not valid
    if (!valid) {
      throw new Error('invalid user or password')
    }
    //sucessful login
    return true; // it word
  }
}