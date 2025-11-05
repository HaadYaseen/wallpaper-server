import { GraphQLResolveInfo } from 'graphql';
import { User } from '@prisma/client';
import { GraphQLContext } from '../utils/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  accessTokenExpiresAt: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenExpiresAt: Scalars['String']['output'];
  user: User;
};

export type CreateDummyInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Dummy = {
  __typename?: 'Dummy';
  avatar?: Maybe<Scalars['String']['output']>;
  bannedAt?: Maybe<Scalars['String']['output']>;
  bannedReason?: Maybe<Scalars['String']['output']>;
  bannedUntil?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isBanned: Scalars['Boolean']['output'];
  isOnline: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type GoogleAuthInput = {
  idToken: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createDummy?: Maybe<Dummy>;
  deleteDummy: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  googleAuth: AuthResponse;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  logoutAll: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  signUp: AuthResponse;
  updateDummy?: Maybe<Dummy>;
  updateUser?: Maybe<User>;
};


export type MutationCreateDummyArgs = {
  input: CreateDummyInput;
};


export type MutationDeleteDummyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGoogleAuthArgs = {
  input: GoogleAuthInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateDummyArgs = {
  input: UpdateDummyInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  dummies: Array<Dummy>;
  dummy?: Maybe<Dummy>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryDummyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Judge = 'JUDGE',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

export type SignUpInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UpdateDummyInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bannedAt?: Maybe<Scalars['String']['output']>;
  bannedReason?: Maybe<Scalars['String']['output']>;
  bannedUntil?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isBanned: Scalars['Boolean']['output'];
  isOnline: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthResponse: ResolverTypeWrapper<Omit<AuthResponse, 'user'> & { user: ResolversTypes['User'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateDummyInput: CreateDummyInput;
  Dummy: ResolverTypeWrapper<Dummy>;
  GoogleAuthInput: GoogleAuthInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateDummyInput: UpdateDummyInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: Omit<AuthResponse, 'user'> & { user: ResolversParentTypes['User'] };
  Boolean: Scalars['Boolean']['output'];
  CreateDummyInput: CreateDummyInput;
  Dummy: Dummy;
  GoogleAuthInput: GoogleAuthInput;
  ID: Scalars['ID']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  SignUpInput: SignUpInput;
  String: Scalars['String']['output'];
  UpdateDummyInput: UpdateDummyInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
}>;

export type AuthResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accessTokenExpiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshTokenExpiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DummyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Dummy'] = ResolversParentTypes['Dummy']> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedUntil?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isBanned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isOnline?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastLogin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createDummy?: Resolver<Maybe<ResolversTypes['Dummy']>, ParentType, ContextType, RequireFields<MutationCreateDummyArgs, 'input'>>;
  deleteDummy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDummyArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  googleAuth?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationGoogleAuthArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logoutAll?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>;
  signUp?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateDummy?: Resolver<Maybe<ResolversTypes['Dummy']>, ParentType, ContextType, RequireFields<MutationUpdateDummyArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  dummies?: Resolver<Array<ResolversTypes['Dummy']>, ParentType, ContextType>;
  dummy?: Resolver<Maybe<ResolversTypes['Dummy']>, ParentType, ContextType, RequireFields<QueryDummyArgs, 'id'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedUntil?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isBanned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isOnline?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastLogin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Dummy?: DummyResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

