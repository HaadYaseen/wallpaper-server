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

export type ContestResultGraphqlType = {
  __typename?: 'ContestResultGraphqlType';
  contest: ContestGraphqlType;
  contestId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  firstPlaceUser: UserGraphqlType;
  firstPlaceUserId: Scalars['String']['output'];
  firstPlaceWallpaper: WallpaperGraphqlType;
  firstPlaceWallpaperId: Scalars['String']['output'];
  honorableMentions: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  secondPlaceUser: UserGraphqlType;
  secondPlaceUserId: Scalars['String']['output'];
  secondPlaceWallpaper: WallpaperGraphqlType;
  secondPlaceWallpaperId: Scalars['String']['output'];
  thirdPlaceUser: UserGraphqlType;
  thirdPlaceUserId: Scalars['String']['output'];
  thirdPlaceWallpaper: WallpaperGraphqlType;
  thirdPlaceWallpaperId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  wallpaperUrls: Array<Scalars['String']['output']>;
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
  durationInDays: Scalars['Int']['input'];
  firstPrize: Scalars['Int']['input'];
  secondPrize: Scalars['Int']['input'];
  startTime: Scalars['DateTime']['input'];
  thirdPrize: Scalars['Int']['input'];
  totalPrize: Scalars['Int']['input'];
};

export type CreateContestResultInput = {
  contestId: Scalars['String']['input'];
};

export type CreateWallpaperInput = {
  contestId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  isAudioEnabled: Scalars['Boolean']['input'];
  isContestWallpaper: Scalars['Boolean']['input'];
  isLiveWallpaper: Scalars['Boolean']['input'];
  isSubmittedByOwner: Scalars['Boolean']['input'];
  orientation: Orientation;
  resolution: Scalars['String']['input'];
  submittedById: Scalars['String']['input'];
  tags: Array<InputMaybe<Scalars['String']['input']>>;
  url: Scalars['String']['input'];
};

export type CreateWallpaperResultInput = {
  appeal: Scalars['Int']['input'];
  colorScheme: Scalars['Int']['input'];
  creativity: Scalars['Int']['input'];
  judgedById: Scalars['String']['input'];
  miscellaneousScore: Scalars['Int']['input'];
  overallRating: Scalars['Int']['input'];
  ownership: Scalars['Int']['input'];
  publicRating: Scalars['Int']['input'];
  readability: Scalars['Int']['input'];
  socialCredit: Scalars['Int']['input'];
  versatility: Scalars['Int']['input'];
  wallpaperId: Scalars['String']['input'];
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
  acceptOrRejectWallpaper: Scalars['Boolean']['output'];
  createContest?: Maybe<ContestGraphqlType>;
  createContestResult: ContestResultGraphqlType;
  createWallpaper?: Maybe<WallpaperGraphqlType>;
  createWallpaperResult: WallpaperResultGraphqlType;
  deleteContest: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteWallpaper: Scalars['Boolean']['output'];
  googleAuth: AuthResponse;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  logoutAll: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  signUp: SignUpResponse;
  updateContest?: Maybe<ContestGraphqlType>;
  updateUser?: Maybe<UserGraphqlType>;
  updateWallpaperResult: WallpaperResultGraphqlType;
  verifyEmail: AuthResponse;
};


export type MutationAcceptOrRejectWallpaperArgs = {
  input: AcceptOrRejectWallpaperInput;
};


export type MutationCreateContestArgs = {
  input: CreateContestInput;
};


export type MutationCreateContestResultArgs = {
  input: CreateContestResultInput;
};


export type MutationCreateWallpaperArgs = {
  input: CreateWallpaperInput;
};


export type MutationCreateWallpaperResultArgs = {
  input: CreateWallpaperResultInput;
};


export type MutationDeleteContestArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteWallpaperArgs = {
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


export type MutationUpdateWallpaperResultArgs = {
  input: UpdateWallpaperResultInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

export enum Orientation {
  Landscape = 'LANDSCAPE',
  Portrait = 'PORTRAIT'
}

export type Pagination = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  contest?: Maybe<ContestGraphqlType>;
  contestResult: ContestResultGraphqlType;
  contestResults: Array<ContestResultGraphqlType>;
  contests: Array<ContestGraphqlType>;
  me?: Maybe<UserGraphqlType>;
  user?: Maybe<UserGraphqlType>;
  users: Array<UserGraphqlType>;
  wallpaper?: Maybe<WallpaperGraphqlType>;
  wallpaperResult: WallpaperResultGraphqlType;
  wallpaperResults: Array<WallpaperResultGraphqlType>;
  wallpapers: Array<WallpaperGraphqlType>;
};


export type QueryContestArgs = {
  id: Scalars['String']['input'];
};


export type QueryContestResultArgs = {
  id: Scalars['String']['input'];
};


export type QueryContestResultsArgs = {
  filter?: InputMaybe<QueryContestResultsFilterInput>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryContestsArgs = {
  filter?: InputMaybe<QueryContestsFilterInput>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<QueryUsersFilterInput>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryWallpaperArgs = {
  id: Scalars['String']['input'];
};


export type QueryWallpaperResultArgs = {
  id: Scalars['String']['input'];
};


export type QueryWallpaperResultsArgs = {
  filter?: InputMaybe<QueryWallpaperResultsFilterInput>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryWallpapersArgs = {
  filter?: InputMaybe<QueryWallpapersFilterInput>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryContestResultsFilterInput = {
  contestStatus?: InputMaybe<ContestStatus>;
  contestType?: InputMaybe<ContestType>;
  participantId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryContestsFilterInput = {
  contestStatus?: InputMaybe<ContestStatus>;
  contestType?: InputMaybe<ContestType>;
  participantId?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QueryUsersFilterInput = {
  isBanned?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Role>;
};

export type QueryWallpaperResultsFilterInput = {
  judgedById?: InputMaybe<Scalars['String']['input']>;
  wallpaperId?: InputMaybe<Scalars['String']['input']>;
  wallpaperStatus?: InputMaybe<WallpaperStatus>;
};

export type QueryWallpapersFilterInput = {
  contestId?: InputMaybe<Scalars['String']['input']>;
  isAudioEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isContestWallpaper?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isLiveWallpaper?: InputMaybe<Scalars['Boolean']['input']>;
  isSubmittedByOwner?: InputMaybe<Scalars['Boolean']['input']>;
  orientation?: InputMaybe<Orientation>;
  resolution?: InputMaybe<Scalars['String']['input']>;
  submittedById?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  wallpaperStatus?: InputMaybe<WallpaperStatus>;
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

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  message: Scalars['String']['output'];
  user: UserGraphqlType;
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

export type UpdateWallpaperResultInput = {
  appeal: Scalars['Int']['input'];
  colorScheme: Scalars['Int']['input'];
  creativity: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  miscellaneousScore: Scalars['Int']['input'];
  overallRating: Scalars['Int']['input'];
  publicRating: Scalars['Int']['input'];
  readability: Scalars['Int']['input'];
  socialCredit: Scalars['Int']['input'];
  versatility: Scalars['Int']['input'];
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

export type VerifyEmailInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type WallpaperGraphqlType = {
  __typename?: 'WallpaperGraphqlType';
  contest?: Maybe<ContestGraphqlType>;
  contestId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isAudioEnabled: Scalars['Boolean']['output'];
  isContestWallpaper: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isLiveWallpaper: Scalars['Boolean']['output'];
  isSubmittedByOwner: Scalars['Boolean']['output'];
  orientation: Orientation;
  overallRating: Scalars['Int']['output'];
  publicRating: Scalars['Int']['output'];
  rejectedReason?: Maybe<Scalars['String']['output']>;
  resolution: Scalars['String']['output'];
  submittedAt: Scalars['String']['output'];
  submittedBy: UserGraphqlType;
  submittedById: Scalars['String']['output'];
  tags: Array<Maybe<Scalars['String']['output']>>;
  updatedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
  wallpaperStatus: WallpaperStatus;
};

export type WallpaperResultGraphqlType = {
  __typename?: 'WallpaperResultGraphqlType';
  appeal: Scalars['Int']['output'];
  colorScheme: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  creativity: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  judgedBy: UserGraphqlType;
  judgedById: Scalars['String']['output'];
  miscellaneousScore: Scalars['Int']['output'];
  overallRating: Scalars['Int']['output'];
  ownership: Scalars['Int']['output'];
  publicRating: Scalars['Int']['output'];
  readability: Scalars['Int']['output'];
  socialCredit: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  versatility: Scalars['Int']['output'];
  wallpaperId: Scalars['String']['output'];
};

export enum WallpaperStatus {
  Approved = 'APPROVED',
  Judged = 'JUDGED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED'
}

export type AcceptOrRejectWallpaperInput = {
  rejectedReason?: InputMaybe<Scalars['String']['input']>;
  wallpaperId: Scalars['String']['input'];
  wallpaperStatus: WallpaperStatus;
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
  ContestResultGraphqlType: ResolverTypeWrapper<ContestResultGraphqlType>;
  ContestStatus: ContestStatus;
  ContestType: ContestType;
  CreateContestInput: CreateContestInput;
  CreateContestResultInput: CreateContestResultInput;
  CreateWallpaperInput: CreateWallpaperInput;
  CreateWallpaperResultInput: CreateWallpaperResultInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  GoogleAuthInput: GoogleAuthInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Orientation: Orientation;
  Pagination: Pagination;
  Query: ResolverTypeWrapper<{}>;
  QueryContestResultsFilterInput: QueryContestResultsFilterInput;
  QueryContestsFilterInput: QueryContestsFilterInput;
  QueryUsersFilterInput: QueryUsersFilterInput;
  QueryWallpaperResultsFilterInput: QueryWallpaperResultsFilterInput;
  QueryWallpapersFilterInput: QueryWallpapersFilterInput;
  Role: Role;
  SignUpInput: SignUpInput;
  SignUpResponse: ResolverTypeWrapper<SignUpResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateContestInput: UpdateContestInput;
  UpdateUserInput: UpdateUserInput;
  UpdateWallpaperResultInput: UpdateWallpaperResultInput;
  UserGraphqlType: ResolverTypeWrapper<UserGraphqlType>;
  VerifyEmailInput: VerifyEmailInput;
  WallpaperGraphqlType: ResolverTypeWrapper<WallpaperGraphqlType>;
  WallpaperResultGraphqlType: ResolverTypeWrapper<WallpaperResultGraphqlType>;
  WallpaperStatus: WallpaperStatus;
  acceptOrRejectWallpaperInput: AcceptOrRejectWallpaperInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  ContestGraphqlType: ContestGraphqlType;
  ContestResultGraphqlType: ContestResultGraphqlType;
  CreateContestInput: CreateContestInput;
  CreateContestResultInput: CreateContestResultInput;
  CreateWallpaperInput: CreateWallpaperInput;
  CreateWallpaperResultInput: CreateWallpaperResultInput;
  DateTime: Scalars['DateTime']['output'];
  GoogleAuthInput: GoogleAuthInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Pagination: Pagination;
  Query: {};
  QueryContestResultsFilterInput: QueryContestResultsFilterInput;
  QueryContestsFilterInput: QueryContestsFilterInput;
  QueryUsersFilterInput: QueryUsersFilterInput;
  QueryWallpaperResultsFilterInput: QueryWallpaperResultsFilterInput;
  QueryWallpapersFilterInput: QueryWallpapersFilterInput;
  SignUpInput: SignUpInput;
  SignUpResponse: SignUpResponse;
  String: Scalars['String']['output'];
  UpdateContestInput: UpdateContestInput;
  UpdateUserInput: UpdateUserInput;
  UpdateWallpaperResultInput: UpdateWallpaperResultInput;
  UserGraphqlType: UserGraphqlType;
  VerifyEmailInput: VerifyEmailInput;
  WallpaperGraphqlType: WallpaperGraphqlType;
  WallpaperResultGraphqlType: WallpaperResultGraphqlType;
  acceptOrRejectWallpaperInput: AcceptOrRejectWallpaperInput;
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

export type ContestResultGraphqlTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ContestResultGraphqlType'] = ResolversParentTypes['ContestResultGraphqlType']> = ResolversObject<{
  contest?: Resolver<ResolversTypes['ContestGraphqlType'], ParentType, ContextType>;
  contestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstPlaceUser?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  firstPlaceUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstPlaceWallpaper?: Resolver<ResolversTypes['WallpaperGraphqlType'], ParentType, ContextType>;
  firstPlaceWallpaperId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  honorableMentions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secondPlaceUser?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  secondPlaceUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secondPlaceWallpaper?: Resolver<ResolversTypes['WallpaperGraphqlType'], ParentType, ContextType>;
  secondPlaceWallpaperId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thirdPlaceUser?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  thirdPlaceUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thirdPlaceWallpaper?: Resolver<ResolversTypes['WallpaperGraphqlType'], ParentType, ContextType>;
  thirdPlaceWallpaperId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wallpaperUrls?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
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
  acceptOrRejectWallpaper?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAcceptOrRejectWallpaperArgs, 'input'>>;
  createContest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<MutationCreateContestArgs, 'input'>>;
  createContestResult?: Resolver<ResolversTypes['ContestResultGraphqlType'], ParentType, ContextType, RequireFields<MutationCreateContestResultArgs, 'input'>>;
  createWallpaper?: Resolver<Maybe<ResolversTypes['WallpaperGraphqlType']>, ParentType, ContextType, RequireFields<MutationCreateWallpaperArgs, 'input'>>;
  createWallpaperResult?: Resolver<ResolversTypes['WallpaperResultGraphqlType'], ParentType, ContextType, RequireFields<MutationCreateWallpaperResultArgs, 'input'>>;
  deleteContest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContestArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteWallpaper?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteWallpaperArgs, 'id'>>;
  googleAuth?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationGoogleAuthArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logoutAll?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>;
  signUp?: Resolver<ResolversTypes['SignUpResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateContest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<MutationUpdateContestArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateWallpaperResult?: Resolver<ResolversTypes['WallpaperResultGraphqlType'], ParentType, ContextType, RequireFields<MutationUpdateWallpaperResultArgs, 'input'>>;
  verifyEmail?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, RequireFields<QueryContestArgs, 'id'>>;
  contestResult?: Resolver<ResolversTypes['ContestResultGraphqlType'], ParentType, ContextType, RequireFields<QueryContestResultArgs, 'id'>>;
  contestResults?: Resolver<Array<ResolversTypes['ContestResultGraphqlType']>, ParentType, ContextType, Partial<QueryContestResultsArgs>>;
  contests?: Resolver<Array<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType, Partial<QueryContestsArgs>>;
  me?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['UserGraphqlType']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['UserGraphqlType']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
  wallpaper?: Resolver<Maybe<ResolversTypes['WallpaperGraphqlType']>, ParentType, ContextType, RequireFields<QueryWallpaperArgs, 'id'>>;
  wallpaperResult?: Resolver<ResolversTypes['WallpaperResultGraphqlType'], ParentType, ContextType, RequireFields<QueryWallpaperResultArgs, 'id'>>;
  wallpaperResults?: Resolver<Array<ResolversTypes['WallpaperResultGraphqlType']>, ParentType, ContextType, Partial<QueryWallpaperResultsArgs>>;
  wallpapers?: Resolver<Array<ResolversTypes['WallpaperGraphqlType']>, ParentType, ContextType, Partial<QueryWallpapersArgs>>;
}>;

export type SignUpResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SignUpResponse'] = ResolversParentTypes['SignUpResponse']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type WallpaperGraphqlTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WallpaperGraphqlType'] = ResolversParentTypes['WallpaperGraphqlType']> = ResolversObject<{
  contest?: Resolver<Maybe<ResolversTypes['ContestGraphqlType']>, ParentType, ContextType>;
  contestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAudioEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isContestWallpaper?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isFeatured?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isLiveWallpaper?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSubmittedByOwner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  orientation?: Resolver<ResolversTypes['Orientation'], ParentType, ContextType>;
  overallRating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publicRating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rejectedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resolution?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submittedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submittedBy?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  submittedById?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wallpaperStatus?: Resolver<ResolversTypes['WallpaperStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WallpaperResultGraphqlTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WallpaperResultGraphqlType'] = ResolversParentTypes['WallpaperResultGraphqlType']> = ResolversObject<{
  appeal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  colorScheme?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creativity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  judgedBy?: Resolver<ResolversTypes['UserGraphqlType'], ParentType, ContextType>;
  judgedById?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  miscellaneousScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overallRating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ownership?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publicRating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  readability?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  socialCredit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  versatility?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wallpaperId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  ContestGraphqlType?: ContestGraphqlTypeResolvers<ContextType>;
  ContestResultGraphqlType?: ContestResultGraphqlTypeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUpResponse?: SignUpResponseResolvers<ContextType>;
  UserGraphqlType?: UserGraphqlTypeResolvers<ContextType>;
  WallpaperGraphqlType?: WallpaperGraphqlTypeResolvers<ContextType>;
  WallpaperResultGraphqlType?: WallpaperResultGraphqlTypeResolvers<ContextType>;
}>;

