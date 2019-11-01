import { Resolver, Query, Mutation, Arg, ObjectType, Field } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from './entity/User';

//can query accesstokens to test
@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

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
  @Mutation(() => LoginResponse)// mutations is what we want changable in the database
  async login(
    @Arg('email') email: string,// name of gql schema and type arguments
    @Arg('password') password: string,
  ): Promise<LoginResponse> {// once user logins access token is generated
    const user = await User.findOne({ where: { email } });// search to see if email matches email
    //if no user
    if (!user) {
      throw new Error('invalid login')
    }

    //compare passwords// import compare from b crypt
    const valid = await compare(password, user.password)

    //if not valid
    if (!valid) {
      throw new Error('invalid user or password')
    }
    //sucessful login
    //generates acess token 
    return {
      accessToken: sign({userId: user.id}, 'retgasutkalw', {expiresIn: '15m'})
    }
  }
}