import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../utils/context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  accessTokenExpiresAt: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenExpiresAt: Scalars['String']['output'];
  user: UserGraphqlType;
};

export type ContestGraphqlType = {
  __typename?: 'ContestGraphqlType';
  contestStatus: ContestStatus;
  contestType: ContestType;
  createdAt: Scalars['DateTime']['output'];
  endTime: Scalars['DateTime']['output'];
  firstPrize: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  resultAnnouncedAt?: Maybe<Scalars['DateTime']['output']>;
  secondPrize: Scalars['Int']['output'];
  startTime: Scalars['DateTime']['output'];
  thirdPrize: Scalars['Int']['output'];
  totalPrize: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum ContestStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Upcoming = 'UPCOMING'
}

export enum ContestType {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE'
}

export type CreateContestInput = {
  contestStatus: ContestStatus;
  contestType: ContestType;
  endTime: Scalars['DateTime']['input'];
  firstPrize: Scalars['Int']['input'];
  secondPrize: Scalars['Int']['input'];
  startTime: Scalars['DateTime']['input'];
  thirdPrize: Scalars['Int']['input'];
  totalPrize: Scalars['Int']['input'];
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
  createContest?: Maybe<ContestGraphqlType>;
  deleteContest: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  googleAuth: AuthResponse;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  logoutAll: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  signUp: AuthResponse;
  updateContest?: Maybe<ContestGraphqlType>;
  updateUser?: Maybe<UserGraphqlType>;
};


export type MutationCreateContestArgs = {
  input: CreateContestInput;
};


export type MutationDeleteContestArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
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


export type MutationUpdateContestArgs = {
  input: UpdateContestInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  contest?: Maybe<ContestGraphqlType>;
  contests: Array<ContestGraphqlType>;
  me?: Maybe<UserGraphqlType>;
  user?: Maybe<UserGraphqlType>;
  users: Array<UserGraphqlType>;
};


export type QueryContestArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
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

export type UpdateContestInput = {
  contestStatus: ContestStatus;
  contestType: ContestType;
  endTime: Scalars['DateTime']['input'];
  firstPrize: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  secondPrize: Scalars['Int']['input'];
  startTime: Scalars['DateTime']['input'];
  thirdPrize: Scalars['Int']['input'];
  totalPrize: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserGraphqlType = {
  __typename?: 'UserGraphqlType';
  avatar?: Maybe<Scalars['String']['output']>;
  bannedAt?: Maybe<Scalars['String']['output']>;
  bannedReason?: Maybe<Scalars['String']['output']>;
  bannedUntil?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
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
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ContestGraphqlType: ResolverTypeWrapper<ContestGraphqlType>;
  ContestStatus: ContestStatus;
  ContestType: ContestType;
  CreateContestInput: CreateContestInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  GoogleAuthInput: GoogleAuthInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateContestInput: UpdateContestInput;
  UpdateUserInput: UpdateUserInput;
  UserGraphqlType: ResolverTypeWrapper<UserGraphqlType>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  ContestGraphqlType: ContestGraphqlType;
  CreateContestInput: CreateContestInput;
  DateTime: Scalars['DateTime']['output'];
  GoogleAuthInput: GoogleAuthInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  SignUpInput: SignUpInput;
  String: Scalars['String']['output'];
  UpdateContestInput: UpdateContestInput;
  UpdateUserInput: UpdateUserInput;
  UserGraphqlType: UserGraphqlType;
}>;

export type AuthResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accessTokenExpiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshTokenExpiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestGraphqlTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ContestGraphqlType'] = ResolversParentTypes['ContestGraphqlType']> = ResolversObject<{
  contestStatus?: Resolver<ResolversTypes['ContestStatus'], ParentType, ContextType>;
  contestType?: Resolver<ResolversTypes['ContestType'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstPrize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultAnnouncedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  secondPrize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  thirdPrize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPrize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createContest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<MutationCreateContestArgs, 'input'>>;
  deleteContest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContestArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  googleAuth?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationGoogleAuthArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logoutAll?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>;
  signUp?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateContest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<MutationUpdateContestArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<QueryContestArgs, 'id'>>;
  contests?: Resolver<Array<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['UserGraphqlType']>, ParentType, ContextType>;
}>;

export type UserGraphqlTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserGraphqlType'] = ResolversParentTypes['UserGraphqlType']> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannedUntil?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  ContestGraphqlType?: ContestGraphqlTypeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UserGraphqlType?: UserGraphqlTypeResolvers<ContextType>;
}>;

