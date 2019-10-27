import { Resolver, Query } from 'type-graphql';

@Resolver()
export class UserResolver {// graphql schema goes in here
  @Query( () => String)//type
  hello() {
    return 'hi!'
  }
  
}