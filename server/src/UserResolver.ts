import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { CreateRefreshToken, CreateAccessToken } from './auth';

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
    return true; // it works
  }

  //login mutation/resolver
  @Mutation(() => LoginResponse)// mutations is what we want changable in the database
  async login(
    @Arg('email') email: string,// name of gql schema and type arguments
    @Arg('password') password: string,
    @Ctx() {res}: MyContext//imports type
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
    res.cookie('sammy-sam',//cookie and refresh token
      CreateRefreshToken(user),
      {
        //going to add domain later
        httpOnly: true //so it can not be accesed with javascript
      }
    )
    //generates acess token 
    return {
      accessToken: CreateAccessToken(user)
    }
  }
}