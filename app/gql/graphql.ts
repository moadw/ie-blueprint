/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `ID` scalar type represents a unique MongoDB identifier in collection. MongoDB by default use 12-byte ObjectId value (https://docs.mongodb.com/manual/reference/bson-types/#objectid). But MongoDB also may accepts string or integer as correct values for _id field. */
  MongoID: { input: any; output: any; }
  /** The string representation of JavaScript regexp. You may provide it with flags "/^abc.*\/i" or without flags like "^abc.*". More info about RegExp characters and flags: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
  RegExpAsString: { input: any; output: any; }
};

export type Card = {
  __typename?: 'Card';
  brand?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<Scalars['String']['output']>;
  cvc_check?: Maybe<Scalars['String']['output']>;
  dynamic_last4?: Maybe<Scalars['JSON']['output']>;
  exp_month?: Maybe<Scalars['Float']['output']>;
  exp_year?: Maybe<Scalars['Float']['output']>;
  fingerprint?: Maybe<Scalars['String']['output']>;
  funding?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  last4?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  object?: Maybe<Scalars['String']['output']>;
  tokenization_method?: Maybe<Scalars['JSON']['output']>;
};

export type CategoryCount = {
  __typename?: 'CategoryCount';
  category?: Maybe<Scalars['String']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
};

export type ClassAndStudents = {
  __typename?: 'ClassAndStudents';
  classes: Scalars['Int']['output'];
  students: Scalars['Int']['output'];
};

export type CleverGroup = {
  __typename?: 'CleverGroup';
  data?: Maybe<CleverGroup_Data>;
};

export type CleverGroup_Data = {
  __typename?: 'CleverGroup_Data';
  grade?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
};

export type CreateOneanimalsInput = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  levels?: InputMaybe<Array<InputMaybe<animalsLevelsInput>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneanimalsPayload = {
  __typename?: 'CreateOneanimalsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<animals>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneanimalscategoriesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneanimalscategoriesPayload = {
  __typename?: 'CreateOneanimalscategoriesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<animalscategories>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneannouncementInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneannouncementPayload = {
  __typename?: 'CreateOneannouncementPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<announcement>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnecategoriesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnecategoriesPayload = {
  __typename?: 'CreateOnecategoriesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<categories>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnecheckinquestionInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnecheckinquestionPayload = {
  __typename?: 'CreateOnecheckinquestionPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<checkinquestion>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneclassesInput = {
  activity?: InputMaybe<Array<InputMaybe<classesActivityInput>>>;
  background?: InputMaybe<classesBackgroundInput>;
  bigIdea?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<classesCoverInput>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discussion?: InputMaybe<Array<InputMaybe<classesDiscussionInput>>>;
  documents?: InputMaybe<Array<InputMaybe<classesDocumentsInput>>>;
  extend?: InputMaybe<Array<InputMaybe<classesExtendInput>>>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  extraActivities?: InputMaybe<Scalars['String']['input']>;
  extracurricular?: InputMaybe<classesExtracurricularInput>;
  feedback?: InputMaybe<Scalars['Boolean']['input']>;
  free?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<classesLanguageInput>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  overview?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  reflection?: InputMaybe<Array<InputMaybe<classesReflectionInput>>>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  trailer?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateOneclassesPayload = {
  __typename?: 'CreateOneclassesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<classes>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneclassificationtypeInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneclassificationtypePayload = {
  __typename?: 'CreateOneclassificationtypePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<classificationtype>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnecurriculumcategoryInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnecurriculumcategoryPayload = {
  __typename?: 'CreateOnecurriculumcategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<curriculumcategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnecurriculumsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  animalCategory?: InputMaybe<Scalars['String']['input']>;
  bgImage?: InputMaybe<curriculumsBgImageInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  courseDuration?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<curriculumsCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculumCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  documents?: InputMaybe<Array<InputMaybe<curriculumsDocumentsInput>>>;
  donation?: InputMaybe<Scalars['Boolean']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<curriculumsLanguageInput>;
  leaderBio?: InputMaybe<Scalars['String']['input']>;
  leaderName?: InputMaybe<Scalars['String']['input']>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logo?: InputMaybe<curriculumsLogoInput>;
  loop?: InputMaybe<curriculumsLoopInput>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  pacingGuide?: InputMaybe<curriculumsPacingGuideInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  resources?: InputMaybe<Array<InputMaybe<curriculumsResourcesInput>>>;
  schoolLevel?: InputMaybe<Scalars['String']['input']>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  totalClass?: InputMaybe<Scalars['Float']['input']>;
  totalLesson?: InputMaybe<Scalars['Float']['input']>;
  totalLessonRestricted?: InputMaybe<Scalars['Float']['input']>;
  trailer?: InputMaybe<curriculumsTrailerInput>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnecurriculumsPayload = {
  __typename?: 'CreateOnecurriculumsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<curriculums>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnedistrictInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coverPhoto?: InputMaybe<districtCoverPhotoInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<districtLogoInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  schoolLicense?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userTotal?: InputMaybe<Scalars['Float']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOnedistrictPayload = {
  __typename?: 'CreateOnedistrictPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<district>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnefavoritesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOnefavoritesPayload = {
  __typename?: 'CreateOnefavoritesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<favorites>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnefeedbackInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOnefeedbackPayload = {
  __typename?: 'CreateOnefeedbackPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<feedback>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneimpactInput = {
  cover?: InputMaybe<impactCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOneimpactPayload = {
  __typename?: 'CreateOneimpactPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<impact>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnelessonInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  classificationType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cover?: InputMaybe<lessonCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnelessonPayload = {
  __typename?: 'CreateOnelessonPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<lesson>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnelicensepresetInput = {
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnelicensepresetPayload = {
  __typename?: 'CreateOnelicensepresetPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<licensepreset>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnelifeskillInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<lifeskillIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnelifeskillPayload = {
  __typename?: 'CreateOnelifeskillPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<lifeskill>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnemoodcategoryInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnemoodcategoryPayload = {
  __typename?: 'CreateOnemoodcategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<moodcategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnenarratorsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<narratorsAvatarInput>;
  bio?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnenarratorsPayload = {
  __typename?: 'CreateOnenarratorsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<narrators>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneorganizationtokenInput = {
  cleverDistrictId?: InputMaybe<Scalars['String']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  oneRosterAppId?: InputMaybe<Scalars['String']['input']>;
  oneRosterToken?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneorganizationtokenPayload = {
  __typename?: 'CreateOneorganizationtokenPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<organizationtoken>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnepinInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<pinCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<pinVideoInput>;
};

export type CreateOnepinPayload = {
  __typename?: 'CreateOnepinPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<pin>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnepintemplateInput = {
  cover?: InputMaybe<pintemplateCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<pintemplateVideoInput>;
};

export type CreateOnepintemplatePayload = {
  __typename?: 'CreateOnepintemplatePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<pintemplate>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnequestionsInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  labelHtml?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<questionsLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  responses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  rightAnswers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnequestionsPayload = {
  __typename?: 'CreateOnequestionsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<questions>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneregionInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneregionPayload = {
  __typename?: 'CreateOneregionPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<region>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnereportsInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnereportsPayload = {
  __typename?: 'CreateOnereportsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<reports>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneresourcecategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<resourcecategoryIconInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneresourcecategoryPayload = {
  __typename?: 'CreateOneresourcecategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<resourcecategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneresponsesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<responsesLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneresponsesPayload = {
  __typename?: 'CreateOneresponsesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<responses>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneschoolcodeInput = {
  classes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  expirationDate?: InputMaybe<Scalars['Date']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneschoolcodePayload = {
  __typename?: 'CreateOneschoolcodePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<schoolcode>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneschoollevelInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneschoollevelPayload = {
  __typename?: 'CreateOneschoollevelPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<schoollevel>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneschoolsDataInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  cleverSync?: InputMaybe<Scalars['Boolean']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  partnerCenterId?: InputMaybe<Scalars['String']['input']>;
  partnerProvider?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneschoolsDataPayload = {
  __typename?: 'CreateOneschoolsDataPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<schoolsData>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneskillsetInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<skillsetIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOneskillsetPayload = {
  __typename?: 'CreateOneskillsetPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<skillset>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnesparklibraryInput = {
  article?: InputMaybe<sparklibraryArticleInput>;
  articleBody?: InputMaybe<Scalars['String']['input']>;
  articleQuestion?: InputMaybe<Array<InputMaybe<sparklibraryArticleQuestionInput>>>;
  articleTitle?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<sparklibraryCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  funFact?: InputMaybe<Array<InputMaybe<sparklibraryFunFactInput>>>;
  journals?: InputMaybe<Array<InputMaybe<sparklibraryJournalsInput>>>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  mindfulMoment?: InputMaybe<Array<InputMaybe<sparklibraryMindfulMomentInput>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  takeAwayDescription?: InputMaybe<Scalars['String']['input']>;
  takeAwayLabel?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<sparklibraryVideoInput>;
  videoQuestions?: InputMaybe<Array<InputMaybe<sparklibraryVideoQuestionsInput>>>;
};

export type CreateOnesparklibraryPayload = {
  __typename?: 'CreateOnesparklibraryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<sparklibrary>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnestickerInput = {
  cover?: InputMaybe<stickerCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyVault?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<stickerVideoInput>;
};

export type CreateOnestickerPayload = {
  __typename?: 'CreateOnestickerPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<sticker>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnesubcategoriesInput = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnesubcategoriesPayload = {
  __typename?: 'CreateOnesubcategoriesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<subcategories>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnetapInput = {
  additional?: InputMaybe<Scalars['String']['input']>;
  canva?: InputMaybe<Array<InputMaybe<tapCanvaInput>>>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<tapCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  donation?: InputMaybe<Scalars['Float']['input']>;
  donationVault?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  extraQuestions?: InputMaybe<Array<InputMaybe<tapExtraQuestionsInput>>>;
  intro?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  lifeSkills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<InputMaybe<tapQuestionsInput>>>;
  resources?: InputMaybe<Array<InputMaybe<tapResourcesInput>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  themes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  videos?: InputMaybe<Array<InputMaybe<tapVideosInput>>>;
};

export type CreateOnetapPayload = {
  __typename?: 'CreateOnetapPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<tap>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnethemeInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<themeIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnethemePayload = {
  __typename?: 'CreateOnethemePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<theme>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOneuseranimalsInput = {
  animal?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOneuseranimalsPayload = {
  __typename?: 'CreateOneuseranimalsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<useranimals>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CreateOnevideotapInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  end?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Float']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateOnevideotapPayload = {
  __typename?: 'CreateOnevideotapPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Created document */
  record?: Maybe<videotap>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type CurriculumObj = {
  __typename?: 'CurriculumObj';
  _id?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  animalCategory?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<DocumentType>;
  description?: Maybe<Scalars['String']['output']>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  leaderBio?: Maybe<Scalars['String']['output']>;
  learningGoal?: Maybe<Scalars['String']['output']>;
  lifeSkill?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  logo?: Maybe<DocumentType>;
  loop?: Maybe<DocumentType>;
  resources?: Maybe<Array<Maybe<DocumentType>>>;
  skillSet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  slug?: Maybe<Scalars['String']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  trailer?: Maybe<DocumentType>;
};

export type DateUserCount = {
  __typename?: 'DateUserCount';
  count: Scalars['Int']['output'];
  date: Scalars['String']['output'];
};

export type DocumentType = {
  __typename?: 'DocumentType';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ErrorInterface = {
  /** Generic error message */
  message?: Maybe<Scalars['String']['output']>;
};

export type FilterCountclasslikeInput = {
  AND?: InputMaybe<Array<FilterCountclasslikeInput>>;
  OR?: InputMaybe<Array<FilterCountclasslikeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterCountclasslikeOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterCountclasslikeOperatorsInput = {
  _id?: InputMaybe<FilterCountclasslike_idOperatorsInput>;
  teacher?: InputMaybe<FilterCountclasslikeTeacherOperatorsInput>;
};

export type FilterCountclasslikeTeacherOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterCountclasslike_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyanimalsInput = {
  AND?: InputMaybe<Array<FilterFindManyanimalsInput>>;
  OR?: InputMaybe<Array<FilterFindManyanimalsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyanimalsOperatorsInput>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  levels?: InputMaybe<Array<InputMaybe<FilterFindManyanimalsLevelsInput>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type FilterFindManyanimalsLevelsImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyanimalsLevelsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<FilterFindManyanimalsLevelsImageInput>;
  level?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyanimalsOperatorsInput = {
  _id?: InputMaybe<FilterFindManyanimals_idOperatorsInput>;
};

export type FilterFindManyanimals_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyannouncementInput = {
  AND?: InputMaybe<Array<FilterFindManyannouncementInput>>;
  OR?: InputMaybe<Array<FilterFindManyannouncementInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyannouncementOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyannouncementOperatorsInput = {
  _id?: InputMaybe<FilterFindManyannouncement_idOperatorsInput>;
};

export type FilterFindManyannouncement_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyavatarArtworkInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyavatarInput = {
  AND?: InputMaybe<Array<FilterFindManyavatarInput>>;
  /** Filter premium or free Avatars */
  GREATER_THAN_ZERO?: InputMaybe<Scalars['Boolean']['input']>;
  OR?: InputMaybe<Array<FilterFindManyavatarInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyavatarOperatorsInput>;
  artwork?: InputMaybe<FilterFindManyavatarArtworkInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyavatarOperatorsInput = {
  _id?: InputMaybe<FilterFindManyavatar_idOperatorsInput>;
};

export type FilterFindManyavatar_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyavatartypesInput = {
  AND?: InputMaybe<Array<FilterFindManyavatartypesInput>>;
  OR?: InputMaybe<Array<FilterFindManyavatartypesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyavatartypesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyavatartypesOperatorsInput = {
  _id?: InputMaybe<FilterFindManyavatartypes_idOperatorsInput>;
};

export type FilterFindManyavatartypes_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManybadgesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManybadgesInput = {
  AND?: InputMaybe<Array<FilterFindManybadgesInput>>;
  OR?: InputMaybe<Array<FilterFindManybadgesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManybadgesOperatorsInput>;
  cover?: InputMaybe<FilterFindManybadgesCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManybadgesVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManybadgesOperatorsInput = {
  _id?: InputMaybe<FilterFindManybadges_idOperatorsInput>;
};

export type FilterFindManybadgesVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManybadges_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManybillingtypesInput = {
  AND?: InputMaybe<Array<FilterFindManybillingtypesInput>>;
  OR?: InputMaybe<Array<FilterFindManybillingtypesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManybillingtypesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  dateRenews?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  licenses?: InputMaybe<Scalars['Float']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManybillingtypesOperatorsInput = {
  _id?: InputMaybe<FilterFindManybillingtypes_idOperatorsInput>;
};

export type FilterFindManybillingtypes_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManycategoriesInput = {
  AND?: InputMaybe<Array<FilterFindManycategoriesInput>>;
  OR?: InputMaybe<Array<FilterFindManycategoriesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManycategoriesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManycategoriesOperatorsInput = {
  _id?: InputMaybe<FilterFindManycategories_idOperatorsInput>;
};

export type FilterFindManycategories_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManycheckinquestionInput = {
  AND?: InputMaybe<Array<FilterFindManycheckinquestionInput>>;
  OR?: InputMaybe<Array<FilterFindManycheckinquestionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManycheckinquestionOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManycheckinquestionOperatorsInput = {
  _id?: InputMaybe<FilterFindManycheckinquestion_idOperatorsInput>;
};

export type FilterFindManycheckinquestion_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyclassesActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesBackgroundInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesDiscussionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesExtendInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesExtracurricularInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesInput = {
  AND?: InputMaybe<Array<FilterFindManyclassesInput>>;
  OR?: InputMaybe<Array<FilterFindManyclassesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyclassesOperatorsInput>;
  activity?: InputMaybe<Array<InputMaybe<FilterFindManyclassesActivityInput>>>;
  background?: InputMaybe<FilterFindManyclassesBackgroundInput>;
  bigIdea?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManyclassesCoverInput>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discussion?: InputMaybe<Array<InputMaybe<FilterFindManyclassesDiscussionInput>>>;
  documents?: InputMaybe<Array<InputMaybe<FilterFindManyclassesDocumentsInput>>>;
  extend?: InputMaybe<Array<InputMaybe<FilterFindManyclassesExtendInput>>>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  extraActivities?: InputMaybe<Scalars['String']['input']>;
  extracurricular?: InputMaybe<FilterFindManyclassesExtracurricularInput>;
  feedback?: InputMaybe<Scalars['Boolean']['input']>;
  free?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<FilterFindManyclassesLanguageInput>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  overview?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  reflection?: InputMaybe<Array<InputMaybe<FilterFindManyclassesReflectionInput>>>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  trailer?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FilterFindManyclassesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclassesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<FilterFindManyclassesLanguageEnglishInput>;
  french?: InputMaybe<FilterFindManyclassesLanguageFrenchInput>;
  spanish?: InputMaybe<FilterFindManyclassesLanguageSpanishInput>;
};

export type FilterFindManyclassesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyclassesOperatorsInput = {
  _id?: InputMaybe<FilterFindManyclasses_idOperatorsInput>;
};

export type FilterFindManyclassesReflectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyclasses_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyclassificationtypeInput = {
  AND?: InputMaybe<Array<FilterFindManyclassificationtypeInput>>;
  OR?: InputMaybe<Array<FilterFindManyclassificationtypeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyclassificationtypeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyclassificationtypeOperatorsInput = {
  _id?: InputMaybe<FilterFindManyclassificationtype_idOperatorsInput>;
};

export type FilterFindManyclassificationtype_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyclasslikeInput = {
  AND?: InputMaybe<Array<FilterFindManyclasslikeInput>>;
  OR?: InputMaybe<Array<FilterFindManyclasslikeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyclasslikeOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyclasslikeOperatorsInput = {
  _id?: InputMaybe<FilterFindManyclasslike_idOperatorsInput>;
  teacher?: InputMaybe<FilterFindManyclasslikeTeacherOperatorsInput>;
};

export type FilterFindManyclasslikeTeacherOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyclasslike_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManycurriculumcategoryInput = {
  AND?: InputMaybe<Array<FilterFindManycurriculumcategoryInput>>;
  OR?: InputMaybe<Array<FilterFindManycurriculumcategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManycurriculumcategoryOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManycurriculumcategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindManycurriculumcategory_idOperatorsInput>;
};

export type FilterFindManycurriculumcategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManycurriculumcollectionInput = {
  AND?: InputMaybe<Array<FilterFindManycurriculumcollectionInput>>;
  OR?: InputMaybe<Array<FilterFindManycurriculumcollectionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManycurriculumcollectionOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  gradeLevel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManycurriculumcollectionOperatorsInput = {
  _id?: InputMaybe<FilterFindManycurriculumcollection_idOperatorsInput>;
  slug?: InputMaybe<FilterFindManycurriculumcollectionSlugOperatorsInput>;
};

export type FilterFindManycurriculumcollectionSlugOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManycurriculumcollection_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManydistrictCoverPhotoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManydistrictInput = {
  AND?: InputMaybe<Array<FilterFindManydistrictInput>>;
  OR?: InputMaybe<Array<FilterFindManydistrictInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManydistrictOperatorsInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coverPhoto?: InputMaybe<FilterFindManydistrictCoverPhotoInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<FilterFindManydistrictLogoInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  schoolLicense?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userTotal?: InputMaybe<Scalars['Float']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManydistrictLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManydistrictOperatorsInput = {
  _id?: InputMaybe<FilterFindManydistrict_idOperatorsInput>;
};

export type FilterFindManydistrict_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManydistrictprofileCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManydistrictprofileDistrictOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManydistrictprofileInput = {
  AND?: InputMaybe<Array<FilterFindManydistrictprofileInput>>;
  OR?: InputMaybe<Array<FilterFindManydistrictprofileInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManydistrictprofileOperatorsInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManydistrictprofileCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<FilterFindManydistrictprofileLogoInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManydistrictprofileLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManydistrictprofileOperatorsInput = {
  _id?: InputMaybe<FilterFindManydistrictprofile_idOperatorsInput>;
  district?: InputMaybe<FilterFindManydistrictprofileDistrictOperatorsInput>;
};

export type FilterFindManydistrictprofile_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyfeedbackInput = {
  AND?: InputMaybe<Array<FilterFindManyfeedbackInput>>;
  OR?: InputMaybe<Array<FilterFindManyfeedbackInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyfeedbackOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyfeedbackOperatorsInput = {
  _id?: InputMaybe<FilterFindManyfeedback_idOperatorsInput>;
};

export type FilterFindManyfeedback_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManygradeInput = {
  AND?: InputMaybe<Array<FilterFindManygradeInput>>;
  OR?: InputMaybe<Array<FilterFindManygradeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManygradeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManygradeOperatorsInput = {
  _id?: InputMaybe<FilterFindManygrade_idOperatorsInput>;
};

export type FilterFindManygrade_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyimpactCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyimpactInput = {
  AND?: InputMaybe<Array<FilterFindManyimpactInput>>;
  OR?: InputMaybe<Array<FilterFindManyimpactInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyimpactOperatorsInput>;
  cover?: InputMaybe<FilterFindManyimpactCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyimpactOperatorsInput = {
  _id?: InputMaybe<FilterFindManyimpact_idOperatorsInput>;
};

export type FilterFindManyimpact_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyjournalsCreatedAtOperatorsInput = {
  gte?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
};

export type FilterFindManyjournalsDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyjournalsInput = {
  AND?: InputMaybe<Array<FilterFindManyjournalsInput>>;
  OR?: InputMaybe<Array<FilterFindManyjournalsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyjournalsOperatorsInput>;
  analyze?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  documents?: InputMaybe<Array<InputMaybe<FilterFindManyjournalsDocumentsInput>>>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyjournalsOperatorsInput = {
  _id?: InputMaybe<FilterFindManyjournals_idOperatorsInput>;
  createdAt?: InputMaybe<FilterFindManyjournalsCreatedAtOperatorsInput>;
  question?: InputMaybe<FilterFindManyjournalsQuestionOperatorsInput>;
  scale?: InputMaybe<FilterFindManyjournalsScaleOperatorsInput>;
};

export type FilterFindManyjournalsQuestionOperatorsInput = {
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FilterFindManyjournalsScaleOperatorsInput = {
  gte?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
};

export type FilterFindManyjournals_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManylicensepresetIdentifierOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManylicensepresetInput = {
  AND?: InputMaybe<Array<FilterFindManylicensepresetInput>>;
  OR?: InputMaybe<Array<FilterFindManylicensepresetInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManylicensepresetOperatorsInput>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManylicensepresetOperatorsInput = {
  _id?: InputMaybe<FilterFindManylicensepreset_idOperatorsInput>;
  identifier?: InputMaybe<FilterFindManylicensepresetIdentifierOperatorsInput>;
};

export type FilterFindManylicensepreset_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManylifeskillIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManylifeskillInput = {
  AND?: InputMaybe<Array<FilterFindManylifeskillInput>>;
  OR?: InputMaybe<Array<FilterFindManylifeskillInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManylifeskillOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindManylifeskillIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManylifeskillOperatorsInput = {
  _id?: InputMaybe<FilterFindManylifeskill_idOperatorsInput>;
};

export type FilterFindManylifeskill_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManymoodCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManymoodInput = {
  AND?: InputMaybe<Array<FilterFindManymoodInput>>;
  OR?: InputMaybe<Array<FilterFindManymoodInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManymoodOperatorsInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManymoodCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  textColor?: InputMaybe<Scalars['String']['input']>;
  tips?: InputMaybe<Array<InputMaybe<FilterFindManymoodTipsInput>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManymoodVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManymoodOperatorsInput = {
  _id?: InputMaybe<FilterFindManymood_idOperatorsInput>;
};

export type FilterFindManymoodTipsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManymoodVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManymood_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManymoodcategoryInput = {
  AND?: InputMaybe<Array<FilterFindManymoodcategoryInput>>;
  OR?: InputMaybe<Array<FilterFindManymoodcategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManymoodcategoryOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManymoodcategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindManymoodcategory_idOperatorsInput>;
};

export type FilterFindManymoodcategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManynarratorsAvatarInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManynarratorsInput = {
  AND?: InputMaybe<Array<FilterFindManynarratorsInput>>;
  OR?: InputMaybe<Array<FilterFindManynarratorsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManynarratorsOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<FilterFindManynarratorsAvatarInput>;
  bio?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManynarratorsOperatorsInput = {
  _id?: InputMaybe<FilterFindManynarrators_idOperatorsInput>;
};

export type FilterFindManynarrators_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyorganizationCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyorganizationInput = {
  AND?: InputMaybe<Array<FilterFindManyorganizationInput>>;
  OR?: InputMaybe<Array<FilterFindManyorganizationInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyorganizationOperatorsInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManyorganizationCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  lockedAt?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyorganizationOperatorsInput = {
  _id?: InputMaybe<FilterFindManyorganization_idOperatorsInput>;
};

export type FilterFindManyorganization_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyorganizationtokenInput = {
  AND?: InputMaybe<Array<FilterFindManyorganizationtokenInput>>;
  OR?: InputMaybe<Array<FilterFindManyorganizationtokenInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyorganizationtokenOperatorsInput>;
  cleverDistrictId?: InputMaybe<Scalars['String']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  oneRosterAppId?: InputMaybe<Scalars['String']['input']>;
  oneRosterToken?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyorganizationtokenOperatorsInput = {
  _id?: InputMaybe<FilterFindManyorganizationtoken_idOperatorsInput>;
};

export type FilterFindManyorganizationtoken_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyparentchildrenChildOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyparentchildrenInput = {
  AND?: InputMaybe<Array<FilterFindManyparentchildrenInput>>;
  OR?: InputMaybe<Array<FilterFindManyparentchildrenInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyparentchildrenOperatorsInput>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  approvedAt?: InputMaybe<Scalars['Date']['input']>;
  child?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  slot?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyparentchildrenOperatorsInput = {
  _id?: InputMaybe<FilterFindManyparentchildren_idOperatorsInput>;
  child?: InputMaybe<FilterFindManyparentchildrenChildOperatorsInput>;
};

export type FilterFindManyparentchildren_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManypinCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManypinInput = {
  AND?: InputMaybe<Array<FilterFindManypinInput>>;
  OR?: InputMaybe<Array<FilterFindManypinInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManypinOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManypinCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManypinVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManypinOperatorsInput = {
  _id?: InputMaybe<FilterFindManypin_idOperatorsInput>;
};

export type FilterFindManypinVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManypin_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManypintemplateCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManypintemplateInput = {
  AND?: InputMaybe<Array<FilterFindManypintemplateInput>>;
  OR?: InputMaybe<Array<FilterFindManypintemplateInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManypintemplateOperatorsInput>;
  cover?: InputMaybe<FilterFindManypintemplateCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManypintemplateVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManypintemplateOperatorsInput = {
  _id?: InputMaybe<FilterFindManypintemplate_idOperatorsInput>;
};

export type FilterFindManypintemplateVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManypintemplate_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyprogressDeletedAtOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  ne?: InputMaybe<Scalars['Date']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
};

export type FilterFindManyprogressInput = {
  AND?: InputMaybe<Array<FilterFindManyprogressInput>>;
  OR?: InputMaybe<Array<FilterFindManyprogressInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyprogressOperatorsInput>;
  answerResponse?: InputMaybe<Scalars['Float']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  ended?: InputMaybe<Scalars['Boolean']['input']>;
  extraAnswerResponse?: InputMaybe<Scalars['Float']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  taps?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyprogressOperatorsInput = {
  _id?: InputMaybe<FilterFindManyprogress_idOperatorsInput>;
  deletedAt?: InputMaybe<FilterFindManyprogressDeletedAtOperatorsInput>;
};

export type FilterFindManyprogress_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyregionInput = {
  AND?: InputMaybe<Array<FilterFindManyregionInput>>;
  OR?: InputMaybe<Array<FilterFindManyregionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyregionOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyregionOperatorsInput = {
  _id?: InputMaybe<FilterFindManyregion_idOperatorsInput>;
};

export type FilterFindManyregion_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyreportsInput = {
  AND?: InputMaybe<Array<FilterFindManyreportsInput>>;
  OR?: InputMaybe<Array<FilterFindManyreportsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyreportsOperatorsInput>;
  body?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyreportsOperatorsInput = {
  _id?: InputMaybe<FilterFindManyreports_idOperatorsInput>;
};

export type FilterFindManyreports_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyresourcecategoryIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyresourcecategoryInput = {
  AND?: InputMaybe<Array<FilterFindManyresourcecategoryInput>>;
  OR?: InputMaybe<Array<FilterFindManyresourcecategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyresourcecategoryOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindManyresourcecategoryIconInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyresourcecategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindManyresourcecategory_idOperatorsInput>;
};

export type FilterFindManyresourcecategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyresponsesInput = {
  AND?: InputMaybe<Array<FilterFindManyresponsesInput>>;
  OR?: InputMaybe<Array<FilterFindManyresponsesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyresponsesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<FilterFindManyresponsesLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type FilterFindManyresponsesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyresponsesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyresponsesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<FilterFindManyresponsesLanguageEnglishInput>;
  french?: InputMaybe<FilterFindManyresponsesLanguageFrenchInput>;
  spanish?: InputMaybe<FilterFindManyresponsesLanguageSpanishInput>;
};

export type FilterFindManyresponsesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyresponsesOperatorsInput = {
  _id?: InputMaybe<FilterFindManyresponses_idOperatorsInput>;
};

export type FilterFindManyresponses_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyschoolcodeInput = {
  AND?: InputMaybe<Array<FilterFindManyschoolcodeInput>>;
  OR?: InputMaybe<Array<FilterFindManyschoolcodeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyschoolcodeOperatorsInput>;
  classes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  expirationDate?: InputMaybe<Scalars['Date']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyschoolcodeOperatorsInput = {
  _id?: InputMaybe<FilterFindManyschoolcode_idOperatorsInput>;
};

export type FilterFindManyschoolcode_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyschoollevelInput = {
  AND?: InputMaybe<Array<FilterFindManyschoollevelInput>>;
  OR?: InputMaybe<Array<FilterFindManyschoollevelInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyschoollevelOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyschoollevelOperatorsInput = {
  _id?: InputMaybe<FilterFindManyschoollevel_idOperatorsInput>;
};

export type FilterFindManyschoollevel_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyschoolsettingsInput = {
  AND?: InputMaybe<Array<FilterFindManyschoolsettingsInput>>;
  OR?: InputMaybe<Array<FilterFindManyschoolsettingsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyschoolsettingsOperatorsInput>;
  accessWithClassLink?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithClever?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithEmail?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithGoogle?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  restrictions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyschoolsettingsOperatorsInput = {
  _id?: InputMaybe<FilterFindManyschoolsettings_idOperatorsInput>;
  school?: InputMaybe<FilterFindManyschoolsettingsSchoolOperatorsInput>;
};

export type FilterFindManyschoolsettingsSchoolOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyschoolsettings_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyskillsetIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManyskillsetInput = {
  AND?: InputMaybe<Array<FilterFindManyskillsetInput>>;
  OR?: InputMaybe<Array<FilterFindManyskillsetInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyskillsetOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindManyskillsetIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyskillsetOperatorsInput = {
  _id?: InputMaybe<FilterFindManyskillset_idOperatorsInput>;
};

export type FilterFindManyskillset_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManysparklibraryArticleInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryArticleQuestionInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryFunFactInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryInput = {
  AND?: InputMaybe<Array<FilterFindManysparklibraryInput>>;
  OR?: InputMaybe<Array<FilterFindManysparklibraryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManysparklibraryOperatorsInput>;
  article?: InputMaybe<FilterFindManysparklibraryArticleInput>;
  articleBody?: InputMaybe<Scalars['String']['input']>;
  articleQuestion?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryArticleQuestionInput>>>;
  articleTitle?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManysparklibraryCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  funFact?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryFunFactInput>>>;
  journals?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryJournalsInput>>>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  mindfulMoment?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryMindfulMomentInput>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  takeAwayDescription?: InputMaybe<Scalars['String']['input']>;
  takeAwayLabel?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManysparklibraryVideoInput>;
  videoQuestions?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryVideoQuestionsInput>>>;
};

export type FilterFindManysparklibraryJournalsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryMindfulMomentInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManysparklibraryOperatorsInput = {
  _id?: InputMaybe<FilterFindManysparklibrary_idOperatorsInput>;
};

export type FilterFindManysparklibraryVideoCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryVideoCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<FilterFindManysparklibraryVideoCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryVideoInput = {
  captions?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryVideoCaptionsInput>>>;
  thumbnail?: InputMaybe<FilterFindManysparklibraryVideoThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryVideoQuestionsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibraryVideoThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysparklibrary_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManysparklibraryuserArticleResponsesInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  assert?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FilterFindManysparklibraryuserFunFactInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  assert?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FilterFindManysparklibraryuserInput = {
  AND?: InputMaybe<Array<FilterFindManysparklibraryuserInput>>;
  OR?: InputMaybe<Array<FilterFindManysparklibraryuserInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManysparklibraryuserOperatorsInput>;
  articleResponses?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryuserArticleResponsesInput>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  finished?: InputMaybe<Scalars['Boolean']['input']>;
  found?: InputMaybe<Scalars['Boolean']['input']>;
  funFact?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryuserFunFactInput>>>;
  journals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mindfulMoment?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  videoResponses?: InputMaybe<Array<InputMaybe<FilterFindManysparklibraryuserVideoResponsesInput>>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManysparklibraryuserOperatorsInput = {
  _id?: InputMaybe<FilterFindManysparklibraryuser_idOperatorsInput>;
};

export type FilterFindManysparklibraryuserVideoResponsesInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  assert?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FilterFindManysparklibraryuser_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManystickerCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManystickerInput = {
  AND?: InputMaybe<Array<FilterFindManystickerInput>>;
  OR?: InputMaybe<Array<FilterFindManystickerInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManystickerOperatorsInput>;
  cover?: InputMaybe<FilterFindManystickerCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyVault?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindManystickerVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManystickerOperatorsInput = {
  _id?: InputMaybe<FilterFindManysticker_idOperatorsInput>;
};

export type FilterFindManystickerVideoInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManysticker_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManysubcategoriesInput = {
  AND?: InputMaybe<Array<FilterFindManysubcategoriesInput>>;
  OR?: InputMaybe<Array<FilterFindManysubcategoriesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManysubcategoriesOperatorsInput>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManysubcategoriesOperatorsInput = {
  _id?: InputMaybe<FilterFindManysubcategories_idOperatorsInput>;
};

export type FilterFindManysubcategories_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManytapCanvaInput = {
  ratio?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapClassOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManytapCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapExtraQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapInput = {
  AND?: InputMaybe<Array<FilterFindManytapInput>>;
  /** Filter Tap Time */
  GREATER_THAN_ZERO?: InputMaybe<Scalars['Boolean']['input']>;
  OR?: InputMaybe<Array<FilterFindManytapInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManytapOperatorsInput>;
  additional?: InputMaybe<Scalars['String']['input']>;
  canva?: InputMaybe<Array<InputMaybe<FilterFindManytapCanvaInput>>>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindManytapCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  donation?: InputMaybe<Scalars['Float']['input']>;
  donationVault?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  extraQuestions?: InputMaybe<Array<InputMaybe<FilterFindManytapExtraQuestionsInput>>>;
  intro?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  lifeSkills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<InputMaybe<FilterFindManytapQuestionsInput>>>;
  resources?: InputMaybe<Array<InputMaybe<FilterFindManytapResourcesInput>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  themes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  videos?: InputMaybe<Array<InputMaybe<FilterFindManytapVideosInput>>>;
};

export type FilterFindManytapLessonOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManytapOperatorsInput = {
  _id?: InputMaybe<FilterFindManytap_idOperatorsInput>;
  class?: InputMaybe<FilterFindManytapClassOperatorsInput>;
  lesson?: InputMaybe<FilterFindManytapLessonOperatorsInput>;
  order?: InputMaybe<FilterFindManytapOrderOperatorsInput>;
  slug?: InputMaybe<FilterFindManytapSlugOperatorsInput>;
};

export type FilterFindManytapOrderOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type FilterFindManytapQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapResourcesInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapSlugOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManytapVideosCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapVideosCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<FilterFindManytapVideosCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapVideosInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  captions?: InputMaybe<Array<InputMaybe<FilterFindManytapVideosCaptionsInput>>>;
  narrator?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<FilterFindManytapVideosThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytapVideosThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManytap_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManytaptypeInput = {
  AND?: InputMaybe<Array<FilterFindManytaptypeInput>>;
  OR?: InputMaybe<Array<FilterFindManytaptypeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManytaptypeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManytaptypeOperatorsInput = {
  _id?: InputMaybe<FilterFindManytaptype_idOperatorsInput>;
};

export type FilterFindManytaptype_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManythemeIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindManythemeInput = {
  AND?: InputMaybe<Array<FilterFindManythemeInput>>;
  OR?: InputMaybe<Array<FilterFindManythemeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManythemeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindManythemeIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManythemeOperatorsInput = {
  _id?: InputMaybe<FilterFindManytheme_idOperatorsInput>;
};

export type FilterFindManytheme_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyusertypesInput = {
  AND?: InputMaybe<Array<FilterFindManyusertypesInput>>;
  OR?: InputMaybe<Array<FilterFindManyusertypesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyusertypesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyusertypesOperatorsInput = {
  _id?: InputMaybe<FilterFindManyusertypes_idOperatorsInput>;
};

export type FilterFindManyusertypes_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindManyvideotapInput = {
  AND?: InputMaybe<Array<FilterFindManyvideotapInput>>;
  OR?: InputMaybe<Array<FilterFindManyvideotapInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindManyvideotapOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  end?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Float']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyvideotapOperatorsInput = {
  _id?: InputMaybe<FilterFindManyvideotap_idOperatorsInput>;
};

export type FilterFindManyvideotap_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneanimalsInput = {
  AND?: InputMaybe<Array<FilterFindOneanimalsInput>>;
  OR?: InputMaybe<Array<FilterFindOneanimalsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneanimalsOperatorsInput>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  levels?: InputMaybe<Array<InputMaybe<FilterFindOneanimalsLevelsInput>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type FilterFindOneanimalsLevelsImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneanimalsLevelsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<FilterFindOneanimalsLevelsImageInput>;
  level?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneanimalsOperatorsInput = {
  _id?: InputMaybe<FilterFindOneanimals_idOperatorsInput>;
};

export type FilterFindOneanimals_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneannouncementInput = {
  AND?: InputMaybe<Array<FilterFindOneannouncementInput>>;
  OR?: InputMaybe<Array<FilterFindOneannouncementInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneannouncementOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneannouncementOperatorsInput = {
  _id?: InputMaybe<FilterFindOneannouncement_idOperatorsInput>;
};

export type FilterFindOneannouncement_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneavatarArtworkInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneavatarInput = {
  AND?: InputMaybe<Array<FilterFindOneavatarInput>>;
  OR?: InputMaybe<Array<FilterFindOneavatarInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneavatarOperatorsInput>;
  artwork?: InputMaybe<FilterFindOneavatarArtworkInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneavatarOperatorsInput = {
  _id?: InputMaybe<FilterFindOneavatar_idOperatorsInput>;
};

export type FilterFindOneavatar_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnebadgesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnebadgesInput = {
  AND?: InputMaybe<Array<FilterFindOnebadgesInput>>;
  OR?: InputMaybe<Array<FilterFindOnebadgesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnebadgesOperatorsInput>;
  cover?: InputMaybe<FilterFindOnebadgesCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindOnebadgesVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnebadgesOperatorsInput = {
  _id?: InputMaybe<FilterFindOnebadges_idOperatorsInput>;
};

export type FilterFindOnebadgesVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnebadges_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnecategoriesInput = {
  AND?: InputMaybe<Array<FilterFindOnecategoriesInput>>;
  OR?: InputMaybe<Array<FilterFindOnecategoriesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnecategoriesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnecategoriesOperatorsInput = {
  _id?: InputMaybe<FilterFindOnecategories_idOperatorsInput>;
};

export type FilterFindOnecategories_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnecheckinquestionInput = {
  AND?: InputMaybe<Array<FilterFindOnecheckinquestionInput>>;
  OR?: InputMaybe<Array<FilterFindOnecheckinquestionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnecheckinquestionOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnecheckinquestionOperatorsInput = {
  _id?: InputMaybe<FilterFindOnecheckinquestion_idOperatorsInput>;
};

export type FilterFindOnecheckinquestion_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneclassesActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesBackgroundInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesDiscussionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesExtendInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesExtracurricularInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesInput = {
  AND?: InputMaybe<Array<FilterFindOneclassesInput>>;
  OR?: InputMaybe<Array<FilterFindOneclassesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneclassesOperatorsInput>;
  activity?: InputMaybe<Array<InputMaybe<FilterFindOneclassesActivityInput>>>;
  background?: InputMaybe<FilterFindOneclassesBackgroundInput>;
  bigIdea?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindOneclassesCoverInput>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discussion?: InputMaybe<Array<InputMaybe<FilterFindOneclassesDiscussionInput>>>;
  documents?: InputMaybe<Array<InputMaybe<FilterFindOneclassesDocumentsInput>>>;
  extend?: InputMaybe<Array<InputMaybe<FilterFindOneclassesExtendInput>>>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  extraActivities?: InputMaybe<Scalars['String']['input']>;
  extracurricular?: InputMaybe<FilterFindOneclassesExtracurricularInput>;
  feedback?: InputMaybe<Scalars['Boolean']['input']>;
  free?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<FilterFindOneclassesLanguageInput>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  overview?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  reflection?: InputMaybe<Array<InputMaybe<FilterFindOneclassesReflectionInput>>>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  trailer?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FilterFindOneclassesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclassesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<FilterFindOneclassesLanguageEnglishInput>;
  french?: InputMaybe<FilterFindOneclassesLanguageFrenchInput>;
  spanish?: InputMaybe<FilterFindOneclassesLanguageSpanishInput>;
};

export type FilterFindOneclassesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneclassesOperatorsInput = {
  _id?: InputMaybe<FilterFindOneclasses_idOperatorsInput>;
};

export type FilterFindOneclassesReflectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneclasses_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneclassificationtypeInput = {
  AND?: InputMaybe<Array<FilterFindOneclassificationtypeInput>>;
  OR?: InputMaybe<Array<FilterFindOneclassificationtypeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneclassificationtypeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneclassificationtypeOperatorsInput = {
  _id?: InputMaybe<FilterFindOneclassificationtype_idOperatorsInput>;
};

export type FilterFindOneclassificationtype_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnecurriculumcategoryInput = {
  AND?: InputMaybe<Array<FilterFindOnecurriculumcategoryInput>>;
  OR?: InputMaybe<Array<FilterFindOnecurriculumcategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnecurriculumcategoryOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnecurriculumcategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindOnecurriculumcategory_idOperatorsInput>;
};

export type FilterFindOnecurriculumcategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnecurriculumcollectionInput = {
  AND?: InputMaybe<Array<FilterFindOnecurriculumcollectionInput>>;
  OR?: InputMaybe<Array<FilterFindOnecurriculumcollectionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnecurriculumcollectionOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  gradeLevel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnecurriculumcollectionOperatorsInput = {
  _id?: InputMaybe<FilterFindOnecurriculumcollection_idOperatorsInput>;
  slug?: InputMaybe<FilterFindOnecurriculumcollectionSlugOperatorsInput>;
};

export type FilterFindOnecurriculumcollectionSlugOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnecurriculumcollection_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnedistrictCoverPhotoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnedistrictInput = {
  AND?: InputMaybe<Array<FilterFindOnedistrictInput>>;
  OR?: InputMaybe<Array<FilterFindOnedistrictInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnedistrictOperatorsInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coverPhoto?: InputMaybe<FilterFindOnedistrictCoverPhotoInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<FilterFindOnedistrictLogoInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  schoolLicense?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userTotal?: InputMaybe<Scalars['Float']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnedistrictLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnedistrictOperatorsInput = {
  _id?: InputMaybe<FilterFindOnedistrict_idOperatorsInput>;
};

export type FilterFindOnedistrict_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnedistrictprofileCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnedistrictprofileDistrictOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnedistrictprofileInput = {
  AND?: InputMaybe<Array<FilterFindOnedistrictprofileInput>>;
  OR?: InputMaybe<Array<FilterFindOnedistrictprofileInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnedistrictprofileOperatorsInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindOnedistrictprofileCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<FilterFindOnedistrictprofileLogoInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnedistrictprofileLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnedistrictprofileOperatorsInput = {
  _id?: InputMaybe<FilterFindOnedistrictprofile_idOperatorsInput>;
  district?: InputMaybe<FilterFindOnedistrictprofileDistrictOperatorsInput>;
};

export type FilterFindOnedistrictprofile_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnefeedbackInput = {
  AND?: InputMaybe<Array<FilterFindOnefeedbackInput>>;
  OR?: InputMaybe<Array<FilterFindOnefeedbackInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnefeedbackOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnefeedbackOperatorsInput = {
  _id?: InputMaybe<FilterFindOnefeedback_idOperatorsInput>;
};

export type FilterFindOnefeedback_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnegradeInput = {
  AND?: InputMaybe<Array<FilterFindOnegradeInput>>;
  OR?: InputMaybe<Array<FilterFindOnegradeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnegradeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnegradeOperatorsInput = {
  _id?: InputMaybe<FilterFindOnegrade_idOperatorsInput>;
};

export type FilterFindOnegrade_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneimpactCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneimpactInput = {
  AND?: InputMaybe<Array<FilterFindOneimpactInput>>;
  OR?: InputMaybe<Array<FilterFindOneimpactInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneimpactOperatorsInput>;
  cover?: InputMaybe<FilterFindOneimpactCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneimpactOperatorsInput = {
  _id?: InputMaybe<FilterFindOneimpact_idOperatorsInput>;
};

export type FilterFindOneimpact_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnejournalsDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnejournalsInput = {
  AND?: InputMaybe<Array<FilterFindOnejournalsInput>>;
  OR?: InputMaybe<Array<FilterFindOnejournalsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnejournalsOperatorsInput>;
  analyze?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  documents?: InputMaybe<Array<InputMaybe<FilterFindOnejournalsDocumentsInput>>>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnejournalsOperatorsInput = {
  _id?: InputMaybe<FilterFindOnejournals_idOperatorsInput>;
};

export type FilterFindOnejournals_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnelicensepresetIdentifierOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnelicensepresetInput = {
  AND?: InputMaybe<Array<FilterFindOnelicensepresetInput>>;
  OR?: InputMaybe<Array<FilterFindOnelicensepresetInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnelicensepresetOperatorsInput>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnelicensepresetOperatorsInput = {
  _id?: InputMaybe<FilterFindOnelicensepreset_idOperatorsInput>;
  identifier?: InputMaybe<FilterFindOnelicensepresetIdentifierOperatorsInput>;
};

export type FilterFindOnelicensepreset_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnelifeskillIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnelifeskillInput = {
  AND?: InputMaybe<Array<FilterFindOnelifeskillInput>>;
  OR?: InputMaybe<Array<FilterFindOnelifeskillInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnelifeskillOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindOnelifeskillIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnelifeskillOperatorsInput = {
  _id?: InputMaybe<FilterFindOnelifeskill_idOperatorsInput>;
};

export type FilterFindOnelifeskill_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnemoodCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnemoodInput = {
  AND?: InputMaybe<Array<FilterFindOnemoodInput>>;
  OR?: InputMaybe<Array<FilterFindOnemoodInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnemoodOperatorsInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindOnemoodCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  textColor?: InputMaybe<Scalars['String']['input']>;
  tips?: InputMaybe<Array<InputMaybe<FilterFindOnemoodTipsInput>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindOnemoodVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnemoodOperatorsInput = {
  _id?: InputMaybe<FilterFindOnemood_idOperatorsInput>;
};

export type FilterFindOnemoodTipsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnemoodVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnemood_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnemoodcategoryInput = {
  AND?: InputMaybe<Array<FilterFindOnemoodcategoryInput>>;
  OR?: InputMaybe<Array<FilterFindOnemoodcategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnemoodcategoryOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnemoodcategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindOnemoodcategory_idOperatorsInput>;
};

export type FilterFindOnemoodcategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnenarratorsAvatarInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnenarratorsInput = {
  AND?: InputMaybe<Array<FilterFindOnenarratorsInput>>;
  OR?: InputMaybe<Array<FilterFindOnenarratorsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnenarratorsOperatorsInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<FilterFindOnenarratorsAvatarInput>;
  bio?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnenarratorsOperatorsInput = {
  _id?: InputMaybe<FilterFindOnenarrators_idOperatorsInput>;
};

export type FilterFindOnenarrators_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneorganizationtokenInput = {
  AND?: InputMaybe<Array<FilterFindOneorganizationtokenInput>>;
  OR?: InputMaybe<Array<FilterFindOneorganizationtokenInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneorganizationtokenOperatorsInput>;
  cleverDistrictId?: InputMaybe<Scalars['String']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  oneRosterAppId?: InputMaybe<Scalars['String']['input']>;
  oneRosterToken?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneorganizationtokenOperatorsInput = {
  _id?: InputMaybe<FilterFindOneorganizationtoken_idOperatorsInput>;
};

export type FilterFindOneorganizationtoken_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnepinCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnepinInput = {
  AND?: InputMaybe<Array<FilterFindOnepinInput>>;
  OR?: InputMaybe<Array<FilterFindOnepinInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnepinOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterFindOnepinCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindOnepinVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnepinOperatorsInput = {
  _id?: InputMaybe<FilterFindOnepin_idOperatorsInput>;
};

export type FilterFindOnepinVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnepin_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnepintemplateCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnepintemplateInput = {
  AND?: InputMaybe<Array<FilterFindOnepintemplateInput>>;
  OR?: InputMaybe<Array<FilterFindOnepintemplateInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnepintemplateOperatorsInput>;
  cover?: InputMaybe<FilterFindOnepintemplateCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindOnepintemplateVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnepintemplateOperatorsInput = {
  _id?: InputMaybe<FilterFindOnepintemplate_idOperatorsInput>;
};

export type FilterFindOnepintemplateVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnepintemplate_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneprogressDeletedAtOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  ne?: InputMaybe<Scalars['Date']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
};

export type FilterFindOneprogressInput = {
  AND?: InputMaybe<Array<FilterFindOneprogressInput>>;
  OR?: InputMaybe<Array<FilterFindOneprogressInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneprogressOperatorsInput>;
  answerResponse?: InputMaybe<Scalars['Float']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  ended?: InputMaybe<Scalars['Boolean']['input']>;
  extraAnswerResponse?: InputMaybe<Scalars['Float']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  taps?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneprogressOperatorsInput = {
  _id?: InputMaybe<FilterFindOneprogress_idOperatorsInput>;
  deletedAt?: InputMaybe<FilterFindOneprogressDeletedAtOperatorsInput>;
};

export type FilterFindOneprogress_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneregionInput = {
  AND?: InputMaybe<Array<FilterFindOneregionInput>>;
  OR?: InputMaybe<Array<FilterFindOneregionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneregionOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneregionOperatorsInput = {
  _id?: InputMaybe<FilterFindOneregion_idOperatorsInput>;
};

export type FilterFindOneregion_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnereportsInput = {
  AND?: InputMaybe<Array<FilterFindOnereportsInput>>;
  OR?: InputMaybe<Array<FilterFindOnereportsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnereportsOperatorsInput>;
  body?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnereportsOperatorsInput = {
  _id?: InputMaybe<FilterFindOnereports_idOperatorsInput>;
};

export type FilterFindOnereports_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneresourcecategoryIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneresourcecategoryInput = {
  AND?: InputMaybe<Array<FilterFindOneresourcecategoryInput>>;
  OR?: InputMaybe<Array<FilterFindOneresourcecategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneresourcecategoryOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindOneresourcecategoryIconInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneresourcecategoryOperatorsInput = {
  _id?: InputMaybe<FilterFindOneresourcecategory_idOperatorsInput>;
};

export type FilterFindOneresourcecategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneresponsesInput = {
  AND?: InputMaybe<Array<FilterFindOneresponsesInput>>;
  OR?: InputMaybe<Array<FilterFindOneresponsesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneresponsesOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<FilterFindOneresponsesLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type FilterFindOneresponsesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneresponsesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneresponsesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<FilterFindOneresponsesLanguageEnglishInput>;
  french?: InputMaybe<FilterFindOneresponsesLanguageFrenchInput>;
  spanish?: InputMaybe<FilterFindOneresponsesLanguageSpanishInput>;
};

export type FilterFindOneresponsesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneresponsesOperatorsInput = {
  _id?: InputMaybe<FilterFindOneresponses_idOperatorsInput>;
};

export type FilterFindOneresponses_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneschoolcodeInput = {
  AND?: InputMaybe<Array<FilterFindOneschoolcodeInput>>;
  OR?: InputMaybe<Array<FilterFindOneschoolcodeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneschoolcodeOperatorsInput>;
  classes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  expirationDate?: InputMaybe<Scalars['Date']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneschoolcodeOperatorsInput = {
  _id?: InputMaybe<FilterFindOneschoolcode_idOperatorsInput>;
};

export type FilterFindOneschoolcode_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneschoollevelInput = {
  AND?: InputMaybe<Array<FilterFindOneschoollevelInput>>;
  OR?: InputMaybe<Array<FilterFindOneschoollevelInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneschoollevelOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneschoollevelOperatorsInput = {
  _id?: InputMaybe<FilterFindOneschoollevel_idOperatorsInput>;
};

export type FilterFindOneschoollevel_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneschoolsettingsInput = {
  AND?: InputMaybe<Array<FilterFindOneschoolsettingsInput>>;
  OR?: InputMaybe<Array<FilterFindOneschoolsettingsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneschoolsettingsOperatorsInput>;
  accessWithClassLink?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithClever?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithEmail?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithGoogle?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  restrictions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneschoolsettingsOperatorsInput = {
  _id?: InputMaybe<FilterFindOneschoolsettings_idOperatorsInput>;
  school?: InputMaybe<FilterFindOneschoolsettingsSchoolOperatorsInput>;
};

export type FilterFindOneschoolsettingsSchoolOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneschoolsettings_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneskillsetIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOneskillsetInput = {
  AND?: InputMaybe<Array<FilterFindOneskillsetInput>>;
  OR?: InputMaybe<Array<FilterFindOneskillsetInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneskillsetOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindOneskillsetIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneskillsetOperatorsInput = {
  _id?: InputMaybe<FilterFindOneskillset_idOperatorsInput>;
};

export type FilterFindOneskillset_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnestickerCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnestickerInput = {
  AND?: InputMaybe<Array<FilterFindOnestickerInput>>;
  OR?: InputMaybe<Array<FilterFindOnestickerInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnestickerOperatorsInput>;
  cover?: InputMaybe<FilterFindOnestickerCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyVault?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterFindOnestickerVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnestickerOperatorsInput = {
  _id?: InputMaybe<FilterFindOnesticker_idOperatorsInput>;
};

export type FilterFindOnestickerVideoInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnesticker_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnesubcategoriesInput = {
  AND?: InputMaybe<Array<FilterFindOnesubcategoriesInput>>;
  OR?: InputMaybe<Array<FilterFindOnesubcategoriesInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnesubcategoriesOperatorsInput>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnesubcategoriesOperatorsInput = {
  _id?: InputMaybe<FilterFindOnesubcategories_idOperatorsInput>;
};

export type FilterFindOnesubcategories_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnesubscriptionInput = {
  AND?: InputMaybe<Array<FilterFindOnesubscriptionInput>>;
  OR?: InputMaybe<Array<FilterFindOnesubscriptionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnesubscriptionOperatorsInput>;
  appleLatestReceipt?: InputMaybe<Scalars['String']['input']>;
  autoRenew?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  expirationDate?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  promoCodes?: InputMaybe<Scalars['String']['input']>;
  stripeId?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  usersLeft?: InputMaybe<Scalars['Float']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnesubscriptionOperatorsInput = {
  _id?: InputMaybe<FilterFindOnesubscription_idOperatorsInput>;
};

export type FilterFindOnesubscription_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnethemeIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterFindOnethemeInput = {
  AND?: InputMaybe<Array<FilterFindOnethemeInput>>;
  OR?: InputMaybe<Array<FilterFindOnethemeInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnethemeOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterFindOnethemeIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnethemeOperatorsInput = {
  _id?: InputMaybe<FilterFindOnetheme_idOperatorsInput>;
};

export type FilterFindOnetheme_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOneuseranimalsInput = {
  AND?: InputMaybe<Array<FilterFindOneuseranimalsInput>>;
  OR?: InputMaybe<Array<FilterFindOneuseranimalsInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOneuseranimalsOperatorsInput>;
  animal?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum: Scalars['String']['input'];
  level?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneuseranimalsOperatorsInput = {
  _id?: InputMaybe<FilterFindOneuseranimals_idOperatorsInput>;
};

export type FilterFindOneuseranimals_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnevideosparksInput = {
  AND?: InputMaybe<Array<FilterFindOnevideosparksInput>>;
  OR?: InputMaybe<Array<FilterFindOnevideosparksInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnevideosparksOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparks?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnevideosparksOperatorsInput = {
  _id?: InputMaybe<FilterFindOnevideosparks_idOperatorsInput>;
};

export type FilterFindOnevideosparks_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterFindOnevideotapInput = {
  AND?: InputMaybe<Array<FilterFindOnevideotapInput>>;
  OR?: InputMaybe<Array<FilterFindOnevideotapInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterFindOnevideotapOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  end?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Float']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnevideotapOperatorsInput = {
  _id?: InputMaybe<FilterFindOnevideotap_idOperatorsInput>;
};

export type FilterFindOnevideotap_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateManypinCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateManypinInput = {
  AND?: InputMaybe<Array<FilterUpdateManypinInput>>;
  OR?: InputMaybe<Array<FilterUpdateManypinInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateManypinOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterUpdateManypinCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterUpdateManypinVideoInput>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateManypinOperatorsInput = {
  _id?: InputMaybe<FilterUpdateManypin_idOperatorsInput>;
};

export type FilterUpdateManypinVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateManypin_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateOnecheckinquestionInput = {
  AND?: InputMaybe<Array<FilterUpdateOnecheckinquestionInput>>;
  OR?: InputMaybe<Array<FilterUpdateOnecheckinquestionInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateOnecheckinquestionOperatorsInput>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOnecheckinquestionOperatorsInput = {
  _id?: InputMaybe<FilterUpdateOnecheckinquestion_idOperatorsInput>;
};

export type FilterUpdateOnecheckinquestion_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateOnecheckinuseranswerInput = {
  AND?: InputMaybe<Array<FilterUpdateOnecheckinuseranswerInput>>;
  OR?: InputMaybe<Array<FilterUpdateOnecheckinuseranswerInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateOnecheckinuseranswerOperatorsInput>;
  answer?: InputMaybe<Scalars['String']['input']>;
  checkinQuestion?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOnecheckinuseranswerOperatorsInput = {
  _id?: InputMaybe<FilterUpdateOnecheckinuseranswer_idOperatorsInput>;
};

export type FilterUpdateOnecheckinuseranswer_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateOnecurriculumcategoryInput = {
  AND?: InputMaybe<Array<FilterUpdateOnecurriculumcategoryInput>>;
  OR?: InputMaybe<Array<FilterUpdateOnecurriculumcategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateOnecurriculumcategoryOperatorsInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOnecurriculumcategoryOperatorsInput = {
  _id?: InputMaybe<FilterUpdateOnecurriculumcategory_idOperatorsInput>;
};

export type FilterUpdateOnecurriculumcategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateOneresourcecategoryIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOneresourcecategoryInput = {
  AND?: InputMaybe<Array<FilterUpdateOneresourcecategoryInput>>;
  OR?: InputMaybe<Array<FilterUpdateOneresourcecategoryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateOneresourcecategoryOperatorsInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<FilterUpdateOneresourcecategoryIconInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOneresourcecategoryOperatorsInput = {
  _id?: InputMaybe<FilterUpdateOneresourcecategory_idOperatorsInput>;
};

export type FilterUpdateOneresourcecategory_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type FilterUpdateOnesparklibraryArticleInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryArticleQuestionInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryFunFactInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryInput = {
  AND?: InputMaybe<Array<FilterUpdateOnesparklibraryInput>>;
  OR?: InputMaybe<Array<FilterUpdateOnesparklibraryInput>>;
  _id?: InputMaybe<Scalars['String']['input']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: InputMaybe<FilterUpdateOnesparklibraryOperatorsInput>;
  article?: InputMaybe<FilterUpdateOnesparklibraryArticleInput>;
  articleBody?: InputMaybe<Scalars['String']['input']>;
  articleQuestion?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryArticleQuestionInput>>>;
  articleTitle?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<FilterUpdateOnesparklibraryCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  funFact?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryFunFactInput>>>;
  journals?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryJournalsInput>>>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  mindfulMoment?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryMindfulMomentInput>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  takeAwayDescription?: InputMaybe<Scalars['String']['input']>;
  takeAwayLabel?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<FilterUpdateOnesparklibraryVideoInput>;
  videoQuestions?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryVideoQuestionsInput>>>;
};

export type FilterUpdateOnesparklibraryJournalsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryMindfulMomentInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOnesparklibraryOperatorsInput = {
  _id?: InputMaybe<FilterUpdateOnesparklibrary_idOperatorsInput>;
};

export type FilterUpdateOnesparklibraryVideoCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryVideoCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<FilterUpdateOnesparklibraryVideoCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryVideoInput = {
  captions?: InputMaybe<Array<InputMaybe<FilterUpdateOnesparklibraryVideoCaptionsInput>>>;
  thumbnail?: InputMaybe<FilterUpdateOnesparklibraryVideoThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryVideoQuestionsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibraryVideoThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUpdateOnesparklibrary_idOperatorsInput = {
  exists?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  regex?: InputMaybe<Scalars['RegExpAsString']['input']>;
};

export type JournalProgressCheck = {
  __typename?: 'JournalProgressCheck';
  badge?: Maybe<badgeMedia>;
  journal?: Maybe<journals>;
};

export type MoodIntensityTCInput = {
  id: Scalars['String']['input'];
  intensity?: InputMaybe<Scalars['Int']['input']>;
};

export type MoodRecord = {
  __typename?: 'MoodRecord';
  record?: Maybe<mood>;
  recordId?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  AdminGroupDeleteOne?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  AnimalsCategoriesCreateOne?: Maybe<CreateOneanimalscategoriesPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  AnimalsCategoriesUpdateById?: Maybe<UpdateByIdanimalscategoriesPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  AnimalsCreateOne?: Maybe<CreateOneanimalsPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  AnimalsUpdateById?: Maybe<UpdateByIdanimalsPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  AnnouncementCreateOne?: Maybe<CreateOneannouncementPayload>;
  AnnouncementDeleteOne: Scalars['String']['output'];
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  AnnouncementUpdateOne?: Maybe<UpdateByIdannouncementPayload>;
  AssignPointsExtracurricular?: Maybe<Scalars['String']['output']>;
  AvatarCreateOne?: Maybe<avatar>;
  AvatarDeleteOne: Scalars['String']['output'];
  AvatarPurchase?: Maybe<Scalars['String']['output']>;
  AvatarSetProfilePicture?: Maybe<Scalars['String']['output']>;
  AvatarUpdateOne: Scalars['String']['output'];
  BadgeClaimOne?: Maybe<badges>;
  BadgesCreateOne?: Maybe<badges>;
  BadgesDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  BadgesUpdateOne?: Maybe<UpdateByIdbadgesPayload>;
  CardCreateDelete?: Maybe<Card>;
  CardCreateOne?: Maybe<Card>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  CategoriesCreateOne?: Maybe<CreateOnecategoriesPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  CheckInQuestionCreateOne?: Maybe<CreateOnecheckinquestionPayload>;
  CheckInQuestionDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  CheckInQuestionUpdateOne?: Maybe<UpdateOnecheckinquestionPayload>;
  CheckInUserAnswerCreateOne?: Maybe<checkinuseranswer>;
  CheckInUserAnswerDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  CheckInUserAnswerUpdateOne?: Maybe<UpdateOnecheckinuseranswerPayload>;
  ClassLikeCreateOne?: Maybe<classes>;
  ClassLikeDeleteOne?: Maybe<Scalars['String']['output']>;
  ClassLinkStudentImport?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ClassesCreateOne?: Maybe<CreateOneclassesPayload>;
  ClassesDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ClassesUpdateOne?: Maybe<UpdateByIdclassesPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ClassificationTypeCreateOne?: Maybe<CreateOneclassificationtypePayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ClassificationTypeUpdateOne?: Maybe<UpdateByIdclassificationtypePayload>;
  CleverSchoolImport?: Maybe<Scalars['String']['output']>;
  CleverSchoolTeacherImport?: Maybe<Scalars['String']['output']>;
  CleverStaffImport?: Maybe<Scalars['String']['output']>;
  CleverStudentImport?: Maybe<Scalars['String']['output']>;
  CleverTeacherImport?: Maybe<Scalars['String']['output']>;
  CollectiblesCreateOne?: Maybe<collectible>;
  CollectiblesDeleteOne: Scalars['String']['output'];
  CollectiblesPurchase?: Maybe<Scalars['String']['output']>;
  CollectiblesUpdateOne: Scalars['String']['output'];
  CreateUser?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  CurriculumCategoryCreateOne?: Maybe<CreateOnecurriculumcategoryPayload>;
  CurriculumCategoryDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  CurriculumCategoryUpdateOne?: Maybe<UpdateOnecurriculumcategoryPayload>;
  CurriculumCollectionCreateOne?: Maybe<curriculumcollection>;
  CurriculumCollectionDeleteOne: Scalars['String']['output'];
  CurriculumCollectionUpdateOne: Scalars['String']['output'];
  /** Create one document with mongoose defaults, setters, hooks and validation */
  CurriculumsCreateOne?: Maybe<CreateOnecurriculumsPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  CurriculumsUpdateOne?: Maybe<UpdateByIdcurriculumsPayload>;
  DeleteUsersMany?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  DistrictCreateOne?: Maybe<CreateOnedistrictPayload>;
  DistrictDeleteOne: Scalars['String']['output'];
  DistrictProfileCreateOne?: Maybe<districtprofile>;
  DistrictProfileDeleteOne: Scalars['String']['output'];
  DistrictProfileUpdateOne: Scalars['String']['output'];
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  DistrictUpdateOne?: Maybe<UpdateByIddistrictPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  FavoritesCreateOne?: Maybe<CreateOnefavoritesPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  FeedbackCreateOne?: Maybe<CreateOnefeedbackPayload>;
  FeedbackDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  FeedbackUpdateOne?: Maybe<UpdateByIdfeedbackPayload>;
  GroupAddCurriculum?: Maybe<Scalars['String']['output']>;
  GroupCreateOne?: Maybe<groups>;
  GroupDeleteOne?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  GroupDisableClassOne?: Maybe<Scalars['String']['output']>;
  GroupEnableClassOne?: Maybe<usergroups>;
  GroupFinishedClass?: Maybe<Scalars['Boolean']['output']>;
  GroupFinishedLesson?: Maybe<Scalars['Boolean']['output']>;
  GroupLockOrUnLockClassesMany?: Maybe<Scalars['String']['output']>;
  GroupNextChapter?: Maybe<Scalars['Boolean']['output']>;
  GroupUpdateOne?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ImpactCreateOne?: Maybe<CreateOneimpactPayload>;
  ImpactDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ImpactUpdateOne?: Maybe<UpdateByIdimpactPayload>;
  InfluenceCreateOne?: Maybe<user>;
  InsertUserInGroupOne?: Maybe<usergroups>;
  JournalsCreateOne?: Maybe<JournalProgressCheck>;
  JournalsUpdateOne?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  LessonCreateOne?: Maybe<CreateOnelessonPayload>;
  LessonDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  LessonUpdateOne?: Maybe<UpdateByIdlessonPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  LicensePresetCreateOne?: Maybe<CreateOnelicensepresetPayload>;
  LicensePresetDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  LicensePresetUpdateOne?: Maybe<UpdateByIdlicensepresetPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  LifeSkillCreateOne?: Maybe<CreateOnelifeskillPayload>;
  LifeSkillDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  LifeSkillUpdateOne?: Maybe<UpdateByIdlifeskillPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  MoodCategoryCreateOne?: Maybe<CreateOnemoodcategoryPayload>;
  MoodCategoryDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  MoodCategoryUpdateOne?: Maybe<UpdateByIdmoodcategoryPayload>;
  MoodCreateOne?: Maybe<MoodRecord>;
  MoodDeleteOne?: Maybe<Scalars['String']['output']>;
  MoodUpdateOne?: Maybe<MoodRecord>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  NarratorsCreateOne?: Maybe<CreateOnenarratorsPayload>;
  NarratorsDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  NarratorsUpdateOne?: Maybe<UpdateByIdnarratorsPayload>;
  OneRosterSchoolImport?: Maybe<Scalars['String']['output']>;
  OneRosterTeacherImport?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  OrganizationTokenCreateOne?: Maybe<CreateOneorganizationtokenPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  OrganizationTokenUpdateOne?: Maybe<UpdateByIdorganizationtokenPayload>;
  ParentChildApprove?: Maybe<Scalars['String']['output']>;
  ParentChildRequestCreate?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  PinCreateOne?: Maybe<CreateOnepinPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  PinTemplateCreateOne?: Maybe<CreateOnepintemplatePayload>;
  PinTemplateDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  PinTemplateUpdateOne?: Maybe<UpdateByIdpintemplatePayload>;
  /** Update many documents without returning them: Use Query.update mongoose method. Do not apply mongoose defaults, setters, hooks and validation. */
  PinUpdateOne?: Maybe<UpdateManypinPayload>;
  QuestionTest?: Maybe<Scalars['String']['output']>;
  QuestionnairesCreateOne?: Maybe<QuestionnaireProgressCheck>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  QuestionsCreateOne?: Maybe<CreateOnequestionsPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  QuestionsUpdateOne?: Maybe<UpdateByIdquestionsPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  RegionCreateOne?: Maybe<CreateOneregionPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  RegionUpdateOne?: Maybe<UpdateByIdregionPayload>;
  RemoveGroupOne?: Maybe<Scalars['String']['output']>;
  RemoveUserInGroupOne?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ReportsCreateOne?: Maybe<CreateOnereportsPayload>;
  ReportsDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ReportsUpdateOne?: Maybe<UpdateByIdreportsPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ResourcesCategoryCreateOne?: Maybe<CreateOneresourcecategoryPayload>;
  ResourcesCategoryDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ResourcesCategoryUpdateOne?: Maybe<UpdateOneresourcecategoryPayload>;
  ResourcesCreateOne?: Maybe<resource>;
  ResourcesDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ResourcesUpdateOne?: Maybe<UpdateByIdresourcePayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ResponsesCreateOne?: Maybe<CreateOneresponsesPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ResponsesUpdateOne?: Maybe<UpdateByIdresponsesPayload>;
  SchoolAssignGroups: Scalars['String']['output'];
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SchoolCodeCreateOne?: Maybe<CreateOneschoolcodePayload>;
  SchoolCodeDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SchoolCodeUpdateOne?: Maybe<UpdateByIdschoolcodePayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SchoolCreateOne?: Maybe<CreateOneschoolsDataPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SchoolLevelCreateOne?: Maybe<CreateOneschoollevelPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SchoolLevelUpdateOne?: Maybe<UpdateByIdschoollevelPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SchoolSettingsUpdateOne?: Maybe<UpdateByIdschoolsettingsPayload>;
  SchoolTeachersSendInvitation?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SchoolUpdateOne?: Maybe<UpdateByIdschoolsDataPayload>;
  SchoolUserDeleteOne: Scalars['String']['output'];
  SetUserOrganization?: Maybe<Scalars['String']['output']>;
  SetUserSchool?: Maybe<Scalars['Boolean']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SkillSetCreateOne?: Maybe<CreateOneskillsetPayload>;
  SkillSetDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SkillSetUpdateOne?: Maybe<UpdateByIdskillsetPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SparkLibraryCreateOne?: Maybe<CreateOnesparklibraryPayload>;
  SparkLibraryQuestionnairesCreateOne?: Maybe<SparkResponseResultTC>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  SparkLibraryUpdateOne?: Maybe<UpdateOnesparklibraryPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  StickerCreateOne?: Maybe<CreateOnestickerPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  StickerUpdateOne?: Maybe<UpdateByIdstickerPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  SubCategoriesCreateOne?: Maybe<CreateOnesubcategoriesPayload>;
  SubscriptionsCreateOne?: Maybe<subscription>;
  SubscriptionsUpdateOne?: Maybe<subscription>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  TapCreateOne?: Maybe<CreateOnetapPayload>;
  TapDeleteOne?: Maybe<Scalars['String']['output']>;
  TapStudentUpdateOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  TapUpdateOne?: Maybe<UpdateByIdtapPayload>;
  TeacherAcceptTerms?: Maybe<Scalars['String']['output']>;
  TeacherClassLinkSync?: Maybe<Scalars['Boolean']['output']>;
  TeacherCleverLinkSync?: Maybe<Scalars['Boolean']['output']>;
  TeacherCleverSyncClass?: Maybe<Scalars['Boolean']['output']>;
  TeacherGroupJournalCreateOne?: Maybe<journals>;
  TeacherGroupJournalUpdateOne?: Maybe<Scalars['String']['output']>;
  TeacherJoinByCode?: Maybe<Scalars['String']['output']>;
  TeacherJoinSchool?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  ThemeCreateOne?: Maybe<CreateOnethemePayload>;
  ThemeDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  ThemeUpdateOne?: Maybe<UpdateByIdthemePayload>;
  TimesStudentUpdateOne?: Maybe<Scalars['String']['output']>;
  UpdateUserOrganizationMany?: Maybe<Scalars['String']['output']>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  UserAnimalsCreateOne?: Maybe<CreateOneuseranimalsPayload>;
  UserDonateOne?: Maybe<sticker>;
  UserForgotPassword?: Maybe<Scalars['String']['output']>;
  UserJoinByCode?: Maybe<Scalars['String']['output']>;
  UserJoinSchool?: Maybe<Scalars['Boolean']['output']>;
  UserMoodCreateOne?: Maybe<Scalars['String']['output']>;
  UserOrganizationSendInvitation?: Maybe<userorganization>;
  UserOrganizationUpdateInvitation?: Maybe<Scalars['Boolean']['output']>;
  UserPinClaimOne?: Maybe<pin>;
  UserResetPassword?: Maybe<Scalars['String']['output']>;
  UserResetToken?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  UserUpdateOne?: Maybe<UpdateByIduserPayload>;
  UserUpdateUserType?: Maybe<Scalars['Boolean']['output']>;
  UsersDelete?: Maybe<user>;
  UsersSetPassword?: Maybe<Scalars['String']['output']>;
  UsersSetPasswordAdmin?: Maybe<Scalars['String']['output']>;
  VerifyUserAdmin?: Maybe<Scalars['String']['output']>;
  VideoSparksCreateOne?: Maybe<videosparks>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  VideoTapsCreateOne?: Maybe<CreateOnevideotapPayload>;
  VideoTapsDeleteOne?: Maybe<Scalars['String']['output']>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  VideoTapsUpdateOne?: Maybe<UpdateByIdvideotapPayload>;
  joinByCodeOne?: Maybe<usergroups>;
  sendInvitation?: Maybe<Scalars['String']['output']>;
  setUserProgressOne?: Maybe<ProgressCheck>;
  startClassOne: Scalars['String']['output'];
  userSparkLibraryArticleQuestionsResponseOne?: Maybe<SparkResponseResultTC>;
  userSparkLibraryFoundOne?: Maybe<sparklibrary>;
  userSparkLibraryFunFactQuestionsResponseOne?: Maybe<SparkResponseResultTC>;
  userSparkLibraryJournalResponseOne?: Maybe<SparkResponseResultTC>;
  userSparkLibraryMindfulMomentResponseOne?: Maybe<SparkResponseResultTC>;
};


export type MutationAdminGroupDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAnimalsCategoriesCreateOneArgs = {
  record: CreateOneanimalscategoriesInput;
};


export type MutationAnimalsCategoriesUpdateByIdArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdanimalscategoriesInput;
};


export type MutationAnimalsCreateOneArgs = {
  record: CreateOneanimalsInput;
};


export type MutationAnimalsUpdateByIdArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdanimalsInput;
};


export type MutationAnnouncementCreateOneArgs = {
  record: CreateOneannouncementInput;
};


export type MutationAnnouncementDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAnnouncementUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdannouncementInput;
};


export type MutationAssignPointsExtracurricularArgs = {
  _id: Scalars['String']['input'];
  group: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationAvatarCreateOneArgs = {
  curriculum?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  label: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  type: Scalars['String']['input'];
};


export type MutationAvatarDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAvatarPurchaseArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAvatarSetProfilePictureArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAvatarUpdateOneArgs = {
  _id: Scalars['String']['input'];
  curriculum?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  label: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  type: Scalars['String']['input'];
};


export type MutationBadgeClaimOneArgs = {
  curriculum: Scalars['String']['input'];
};


export type MutationBadgesCreateOneArgs = {
  curriculum: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  label: Scalars['String']['input'];
};


export type MutationBadgesDeleteOneArgs = {
  badge: Scalars['String']['input'];
};


export type MutationBadgesUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdbadgesInput;
};


export type MutationCardCreateDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationCardCreateOneArgs = {
  expirationMonth: Scalars['Int']['input'];
  expirationYear: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  securityCode: Scalars['Int']['input'];
};


export type MutationCategoriesCreateOneArgs = {
  record: CreateOnecategoriesInput;
};


export type MutationCheckInQuestionCreateOneArgs = {
  record: CreateOnecheckinquestionInput;
};


export type MutationCheckInQuestionDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationCheckInQuestionUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateOnecheckinquestionInput>;
  record: UpdateOnecheckinquestionInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateOnecheckinquestionInput>;
};


export type MutationCheckInUserAnswerCreateOneArgs = {
  answer: Scalars['String']['input'];
  checkinQuestion: Scalars['String']['input'];
  class: Scalars['String']['input'];
  group?: InputMaybe<Scalars['String']['input']>;
  scale: Scalars['Int']['input'];
};


export type MutationCheckInUserAnswerDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationCheckInUserAnswerUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateOnecheckinuseranswerInput>;
  record: UpdateOnecheckinuseranswerInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateOnecheckinuseranswerInput>;
};


export type MutationClassLikeCreateOneArgs = {
  class: Scalars['String']['input'];
};


export type MutationClassLikeDeleteOneArgs = {
  class: Scalars['String']['input'];
};


export type MutationClassLinkStudentImportArgs = {
  onlyNewUsers?: InputMaybe<Scalars['Boolean']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  section?: InputMaybe<Scalars['String']['input']>;
};


export type MutationClassesCreateOneArgs = {
  record: CreateOneclassesInput;
};


export type MutationClassesDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationClassesUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdclassesInput;
};


export type MutationClassificationTypeCreateOneArgs = {
  record: CreateOneclassificationtypeInput;
};


export type MutationClassificationTypeUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdclassificationtypeInput;
};


export type MutationCleverSchoolImportArgs = {
  organization: Scalars['String']['input'];
};


export type MutationCleverSchoolTeacherImportArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
  school: Scalars['String']['input'];
  userType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCleverStaffImportArgs = {
  organization: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCleverStudentImportArgs = {
  onlyNewUsers?: InputMaybe<Scalars['Boolean']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  sectionName?: InputMaybe<Scalars['String']['input']>;
  sectionSubject?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCleverTeacherImportArgs = {
  onlyNewUsers?: InputMaybe<Scalars['Boolean']['input']>;
  organization: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCollectiblesCreateOneArgs = {
  curriculum?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  editions: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};


export type MutationCollectiblesDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationCollectiblesPurchaseArgs = {
  _id: Scalars['String']['input'];
};


export type MutationCollectiblesUpdateOneArgs = {
  _id: Scalars['String']['input'];
  curriculum?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  editions: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organization?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sendEmail?: InputMaybe<Scalars['Boolean']['input']>;
  type: Scalars['String']['input'];
};


export type MutationCurriculumCategoryCreateOneArgs = {
  record: CreateOnecurriculumcategoryInput;
};


export type MutationCurriculumCategoryDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationCurriculumCategoryUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateOnecurriculumcategoryInput>;
  record: UpdateOnecurriculumcategoryInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateOnecurriculumcategoryInput>;
};


export type MutationCurriculumCollectionCreateOneArgs = {
  record?: InputMaybe<curriculumcollectionInput>;
};


export type MutationCurriculumCollectionDeleteOneArgs = {
  id: Scalars['String']['input'];
};


export type MutationCurriculumCollectionUpdateOneArgs = {
  id: Scalars['String']['input'];
  record?: InputMaybe<curriculumcollectionInput>;
};


export type MutationCurriculumsCreateOneArgs = {
  record: CreateOnecurriculumsInput;
};


export type MutationCurriculumsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdcurriculumsInput;
};


export type MutationDeleteUsersManyArgs = {
  organization?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationDistrictCreateOneArgs = {
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  record: CreateOnedistrictInput;
};


export type MutationDistrictDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationDistrictProfileCreateOneArgs = {
  record?: InputMaybe<districtprofileInput>;
};


export type MutationDistrictProfileDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationDistrictProfileUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record?: InputMaybe<districtprofileInput>;
};


export type MutationDistrictUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIddistrictInput;
};


export type MutationFavoritesCreateOneArgs = {
  record: CreateOnefavoritesInput;
};


export type MutationFeedbackCreateOneArgs = {
  record: CreateOnefeedbackInput;
};


export type MutationFeedbackDeleteOneArgs = {
  id: Scalars['String']['input'];
};


export type MutationFeedbackUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdfeedbackInput;
};


export type MutationGroupAddCurriculumArgs = {
  curriculum: Scalars['String']['input'];
  group: Scalars['String']['input'];
};


export type MutationGroupCreateOneArgs = {
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  grade?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGroupDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationGroupDisableClassOneArgs = {
  group: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationGroupEnableClassOneArgs = {
  group: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationGroupFinishedClassArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGroupFinishedLessonArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGroupLockOrUnLockClassesManyArgs = {
  group?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationGroupNextChapterArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGroupUpdateOneArgs = {
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  group: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
};


export type MutationImpactCreateOneArgs = {
  record: CreateOneimpactInput;
};


export type MutationImpactDeleteOneArgs = {
  id: Scalars['String']['input'];
};


export type MutationImpactUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdimpactInput;
};


export type MutationInfluenceCreateOneArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationInsertUserInGroupOneArgs = {
  group: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationJournalsCreateOneArgs = {
  body: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  question: Scalars['String']['input'];
  tap: Scalars['String']['input'];
};


export type MutationJournalsUpdateOneArgs = {
  body: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  question: Scalars['String']['input'];
  tap: Scalars['String']['input'];
};


export type MutationLessonCreateOneArgs = {
  record: CreateOnelessonInput;
};


export type MutationLessonDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationLessonUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdlessonInput;
};


export type MutationLicensePresetCreateOneArgs = {
  record: CreateOnelicensepresetInput;
};


export type MutationLicensePresetDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationLicensePresetUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdlicensepresetInput;
};


export type MutationLifeSkillCreateOneArgs = {
  record: CreateOnelifeskillInput;
};


export type MutationLifeSkillDeleteOneArgs = {
  lifeSkill: Scalars['String']['input'];
};


export type MutationLifeSkillUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdlifeskillInput;
};


export type MutationMoodCategoryCreateOneArgs = {
  record: CreateOnemoodcategoryInput;
};


export type MutationMoodCategoryDeleteOneArgs = {
  moodCategory: Scalars['String']['input'];
};


export type MutationMoodCategoryUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdmoodcategoryInput;
};


export type MutationMoodCreateOneArgs = {
  record?: InputMaybe<moodInput>;
};


export type MutationMoodDeleteOneArgs = {
  mood: Scalars['String']['input'];
};


export type MutationMoodUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record?: InputMaybe<moodInput>;
};


export type MutationNarratorsCreateOneArgs = {
  record: CreateOnenarratorsInput;
};


export type MutationNarratorsDeleteOneArgs = {
  id: Scalars['String']['input'];
};


export type MutationNarratorsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdnarratorsInput;
};


export type MutationOneRosterSchoolImportArgs = {
  organization?: InputMaybe<Scalars['String']['input']>;
};


export type MutationOneRosterTeacherImportArgs = {
  onlyNewUsers?: InputMaybe<Scalars['Boolean']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationOrganizationTokenCreateOneArgs = {
  record: CreateOneorganizationtokenInput;
};


export type MutationOrganizationTokenUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdorganizationtokenInput;
};


export type MutationParentChildApproveArgs = {
  _id: Scalars['String']['input'];
  approved: Scalars['Boolean']['input'];
};


export type MutationParentChildRequestCreateArgs = {
  code: Scalars['String']['input'];
};


export type MutationPinCreateOneArgs = {
  record: CreateOnepinInput;
};


export type MutationPinTemplateCreateOneArgs = {
  record: CreateOnepintemplateInput;
};


export type MutationPinTemplateDeleteOneArgs = {
  pinTemplate: Scalars['String']['input'];
};


export type MutationPinTemplateUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdpintemplateInput;
};


export type MutationPinUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateManypinInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  record: UpdateManypinInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateManypinInput>;
};


export type MutationQuestionTestArgs = {
  id: Scalars['String']['input'];
};


export type MutationQuestionnairesCreateOneArgs = {
  answer?: InputMaybe<Array<Scalars['String']['input']>>;
  class?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  question: Scalars['String']['input'];
  tap: Scalars['String']['input'];
};


export type MutationQuestionsCreateOneArgs = {
  record: CreateOnequestionsInput;
};


export type MutationQuestionsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdquestionsInput;
};


export type MutationRegionCreateOneArgs = {
  record: CreateOneregionInput;
};


export type MutationRegionUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdregionInput;
};


export type MutationRemoveGroupOneArgs = {
  group: Scalars['String']['input'];
};


export type MutationRemoveUserInGroupOneArgs = {
  group: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationReportsCreateOneArgs = {
  record: CreateOnereportsInput;
};


export type MutationReportsDeleteOneArgs = {
  report: Scalars['String']['input'];
};


export type MutationReportsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdreportsInput;
};


export type MutationResourcesCategoryCreateOneArgs = {
  record: CreateOneresourcecategoryInput;
};


export type MutationResourcesCategoryDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationResourcesCategoryUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateOneresourcecategoryInput>;
  record: UpdateOneresourcecategoryInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateOneresourcecategoryInput>;
};


export type MutationResourcesCreateOneArgs = {
  record?: InputMaybe<resourceInput>;
};


export type MutationResourcesDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationResourcesUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdresourceInput;
};


export type MutationResponsesCreateOneArgs = {
  record: CreateOneresponsesInput;
};


export type MutationResponsesUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdresponsesInput;
};


export type MutationSchoolAssignGroupsArgs = {
  curriculums?: InputMaybe<Array<Scalars['String']['input']>>;
  schools?: InputMaybe<Array<Scalars['String']['input']>>;
  userType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSchoolCodeCreateOneArgs = {
  record: CreateOneschoolcodeInput;
};


export type MutationSchoolCodeDeleteOneArgs = {
  schoolCode: Scalars['String']['input'];
};


export type MutationSchoolCodeUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdschoolcodeInput;
};


export type MutationSchoolCreateOneArgs = {
  record: CreateOneschoolsDataInput;
};


export type MutationSchoolLevelCreateOneArgs = {
  record: CreateOneschoollevelInput;
};


export type MutationSchoolLevelUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdschoollevelInput;
};


export type MutationSchoolSettingsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdschoolsettingsInput;
};


export type MutationSchoolTeachersSendInvitationArgs = {
  schoolCode: Scalars['String']['input'];
  teacherEmails?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationSchoolUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdschoolsDataInput;
};


export type MutationSchoolUserDeleteOneArgs = {
  school: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationSetUserOrganizationArgs = {
  organization: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationSetUserSchoolArgs = {
  school?: InputMaybe<Scalars['String']['input']>;
  user: Scalars['String']['input'];
};


export type MutationSkillSetCreateOneArgs = {
  record: CreateOneskillsetInput;
};


export type MutationSkillSetDeleteOneArgs = {
  skillSet: Scalars['String']['input'];
};


export type MutationSkillSetUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdskillsetInput;
};


export type MutationSparkLibraryCreateOneArgs = {
  record: CreateOnesparklibraryInput;
};


export type MutationSparkLibraryQuestionnairesCreateOneArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<InputMaybe<QuestionInput>>>;
};


export type MutationSparkLibraryUpdateOneArgs = {
  filter?: InputMaybe<FilterUpdateOnesparklibraryInput>;
  record: UpdateOnesparklibraryInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortUpdateOnesparklibraryInput>;
};


export type MutationStickerCreateOneArgs = {
  record: CreateOnestickerInput;
};


export type MutationStickerUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdstickerInput;
};


export type MutationSubCategoriesCreateOneArgs = {
  record: CreateOnesubcategoriesInput;
};


export type MutationSubscriptionsCreateOneArgs = {
  numberTeachers?: InputMaybe<Scalars['Int']['input']>;
  type: Scalars['String']['input'];
};


export type MutationSubscriptionsUpdateOneArgs = {
  usersId: Scalars['String']['input'];
};


export type MutationTapCreateOneArgs = {
  record: CreateOnetapInput;
};


export type MutationTapDeleteOneArgs = {
  _id: Scalars['String']['input'];
};


export type MutationTapStudentUpdateOneArgs = {
  class?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  tap: Scalars['String']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTapUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdtapInput;
};


export type MutationTeacherClassLinkSyncArgs = {
  user: Scalars['String']['input'];
};


export type MutationTeacherCleverLinkSyncArgs = {
  user: Scalars['String']['input'];
};


export type MutationTeacherCleverSyncClassArgs = {
  cleverId: Scalars['String']['input'];
  groupId: Scalars['String']['input'];
};


export type MutationTeacherGroupJournalCreateOneArgs = {
  body: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
  group: Scalars['String']['input'];
  lesson?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTeacherGroupJournalUpdateOneArgs = {
  body: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
  group: Scalars['String']['input'];
  lesson?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTeacherJoinByCodeArgs = {
  schoolCode: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationTeacherJoinSchoolArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  schoolCode: Scalars['String']['input'];
};


export type MutationThemeCreateOneArgs = {
  record: CreateOnethemeInput;
};


export type MutationThemeDeleteOneArgs = {
  theme: Scalars['String']['input'];
};


export type MutationThemeUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdthemeInput;
};


export type MutationTimesStudentUpdateOneArgs = {
  class: Scalars['String']['input'];
  field: Scalars['String']['input'];
  group?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserOrganizationManyArgs = {
  group: Scalars['String']['input'];
  organization: Scalars['String']['input'];
  school: Scalars['String']['input'];
  users: Array<Scalars['String']['input']>;
};


export type MutationUserAnimalsCreateOneArgs = {
  record: CreateOneuseranimalsInput;
};


export type MutationUserDonateOneArgs = {
  points: Scalars['Int']['input'];
  vault: Scalars['String']['input'];
};


export type MutationUserForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUserJoinByCodeArgs = {
  code: Scalars['String']['input'];
};


export type MutationUserJoinSchoolArgs = {
  district: Scalars['String']['input'];
  school: Scalars['String']['input'];
};


export type MutationUserMoodCreateOneArgs = {
  moods: Array<MoodIntensityTCInput>;
  note?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserOrganizationSendInvitationArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  usertype: Scalars['String']['input'];
};


export type MutationUserOrganizationUpdateInvitationArgs = {
  _id: Scalars['String']['input'];
  response?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUserPinClaimOneArgs = {
  lesson?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUserResetPasswordArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationUserUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIduserInput;
};


export type MutationUserUpdateUserTypeArgs = {
  type: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationUsersDeleteArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationUsersSetPasswordArgs = {
  password: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationUsersSetPasswordAdminArgs = {
  password: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationVerifyUserAdminArgs = {
  code: Scalars['String']['input'];
};


export type MutationVideoSparksCreateOneArgs = {
  _id: Scalars['MongoID']['input'];
};


export type MutationVideoTapsCreateOneArgs = {
  record: CreateOnevideotapInput;
};


export type MutationVideoTapsDeleteOneArgs = {
  videotap: Scalars['String']['input'];
};


export type MutationVideoTapsUpdateOneArgs = {
  _id: Scalars['String']['input'];
  record: UpdateByIdvideotapInput;
};


export type MutationjoinByCodeOneArgs = {
  code: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type MutationsendInvitationArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationsetUserProgressOneArgs = {
  _id: Scalars['String']['input'];
  time: Scalars['Int']['input'];
};


export type MutationstartClassOneArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
};


export type MutationuserSparkLibraryArticleQuestionsResponseOneArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<InputMaybe<QuestionInput>>>;
};


export type MutationuserSparkLibraryFoundOneArgs = {
  _id: Scalars['String']['input'];
  time?: InputMaybe<Scalars['String']['input']>;
};


export type MutationuserSparkLibraryFunFactQuestionsResponseOneArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<InputMaybe<QuestionInput>>>;
};


export type MutationuserSparkLibraryJournalResponseOneArgs = {
  _id: Scalars['String']['input'];
  body: Scalars['String']['input'];
  journal: Scalars['String']['input'];
};


export type MutationuserSparkLibraryMindfulMomentResponseOneArgs = {
  _id: Scalars['String']['input'];
  body: Scalars['String']['input'];
  journal: Scalars['String']['input'];
};

export type ProgressByCurriculum = {
  __typename?: 'ProgressByCurriculum';
  _id?: Maybe<Scalars['String']['output']>;
  check?: Maybe<Scalars['Boolean']['output']>;
  explore?: Maybe<Scalars['Boolean']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  watched?: Maybe<Scalars['Boolean']['output']>;
};

export type ProgressByUser = {
  __typename?: 'ProgressByUser';
  ended?: Maybe<Scalars['Boolean']['output']>;
  journals?: Maybe<Scalars['Float']['output']>;
  numberOfClassEnded?: Maybe<Scalars['Float']['output']>;
  user?: Maybe<ProgressByUser_User>;
};

export type ProgressByUser_User = {
  __typename?: 'ProgressByUser_User';
  _id?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
  profilePicture?: Maybe<ProgressByUser_User_ProfilePicture>;
};

export type ProgressByUser_User_ProfilePicture = {
  __typename?: 'ProgressByUser_User_ProfilePicture';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ProgressCheck = {
  __typename?: 'ProgressCheck';
  badge?: Maybe<badgeMedia>;
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  AnimalsFindMany: Array<animals>;
  AnimalsFindOne?: Maybe<animals>;
  AnnouncementFindMany: Array<announcement>;
  AnnouncementFindOne?: Maybe<announcement>;
  AvatarFindMany: Array<avatar>;
  AvatarFindOne?: Maybe<avatar>;
  AvatarPurchasedFindMany?: Maybe<Array<Maybe<avatar>>>;
  AvatarTypesFindMany: Array<avatartypes>;
  BadgesFindMany: Array<badges>;
  BadgesFindOne?: Maybe<badges>;
  BillingTypesFindMany: Array<billingtypes>;
  CardFindMany?: Maybe<Array<Maybe<Card>>>;
  CategoriesFindMany: Array<categories>;
  CategoriesFindOne?: Maybe<categories>;
  CheckInQuestionFindMany: Array<checkinquestion>;
  CheckInQuestionFindOne?: Maybe<checkinquestion>;
  CheckInUserAnswerFindMany?: Maybe<Array<Maybe<checkinuseranswer>>>;
  CheckInUserAnswerFindOne?: Maybe<checkinuseranswer>;
  ClassJournalsFindMany?: Maybe<Array<Maybe<journals>>>;
  ClassLikeMine?: Maybe<Scalars['Boolean']['output']>;
  ClassLikesCount?: Maybe<Scalars['Int']['output']>;
  ClassLikesFindMany: Array<classlike>;
  ClassesAdminFindMany: Array<classes>;
  ClassesAdminFindOne?: Maybe<classes>;
  ClassesByCurriculumFindOne?: Maybe<Array<Maybe<classes>>>;
  ClassesFindOne?: Maybe<classes>;
  ClassificationTypeFindMany: Array<classificationtype>;
  ClassificationTypeFindOne?: Maybe<classificationtype>;
  CollectiblesByCurriculumFindMany?: Maybe<Array<Maybe<collectible>>>;
  CollectiblesFindMany?: Maybe<Array<Maybe<collectible>>>;
  CollectiblesFindOne?: Maybe<collectible>;
  CoursesInProgress?: Maybe<Array<Maybe<curriculums>>>;
  CurriculumCategoryFindMany: Array<curriculumcategory>;
  CurriculumCategoryFindOne?: Maybe<curriculumcategory>;
  CurriculumsByUser?: Maybe<Array<Maybe<curriculums>>>;
  CurriculumsFindMany?: Maybe<Array<Maybe<curriculums>>>;
  CurriculumsFindOne?: Maybe<curriculums>;
  DistrictFindMany: Array<district>;
  DistrictFindOne?: Maybe<district>;
  DistrictProfileFindMany: Array<districtprofile>;
  DistrictProfileFindOne?: Maybe<districtprofile>;
  FavoritesFindMany?: Maybe<favorites>;
  FeedbackFindMany: Array<feedback>;
  FeedbackFindOne?: Maybe<feedback>;
  GlobalProgressGenerateOne?: Maybe<groupprogress>;
  GradesFindMany: Array<grade>;
  GradesFindOne?: Maybe<grade>;
  GroupFindMany?: Maybe<Array<Maybe<groups>>>;
  GroupFindOne?: Maybe<groups>;
  GroupJournalsFindMany?: Maybe<Array<Maybe<journals>>>;
  GroupProgressByOrganizationFindMany?: Maybe<Array<Maybe<groupprogress>>>;
  GroupProgressFindMany?: Maybe<Array<Maybe<groupprogress>>>;
  GroupProgressFindOne?: Maybe<groupprogress>;
  GroupUserFindOne?: Maybe<groups>;
  ImpactFindMany: Array<impact>;
  ImpactFindOne?: Maybe<impact>;
  InfluencesFindOne?: Maybe<user>;
  JournalsFindMany: Array<journals>;
  JournalsFindOne?: Maybe<journals>;
  LessonFindMany?: Maybe<Array<Maybe<lesson>>>;
  LessonFindOne?: Maybe<lesson>;
  LicensePresetFindMany: Array<licensepreset>;
  LicensePresetFindOne?: Maybe<licensepreset>;
  LifeSkillFindMany: Array<lifeskill>;
  LifeSkillFindOne?: Maybe<lifeskill>;
  MoodCategoryFindMany: Array<moodcategory>;
  MoodCategoryFindOne?: Maybe<moodcategory>;
  MoodFindMany: Array<mood>;
  MoodFindOne?: Maybe<mood>;
  MyLikedClasses?: Maybe<Array<Maybe<classlike>>>;
  MyOrganizationFindOne?: Maybe<organization>;
  OrganizationTokenFindMany: Array<organizationtoken>;
  OrganizationTokenFindOne?: Maybe<organizationtoken>;
  OrganizationUserHistoryFindMany?: Maybe<Array<Maybe<DateUserCount>>>;
  OrganizationsFindMany: Array<organization>;
  ParentChildFindMany: Array<parentchildren>;
  PinFindMany: Array<pin>;
  PinFindOne?: Maybe<pin>;
  PinTemplateFindMany: Array<pintemplate>;
  PinTemplateFindOne?: Maybe<pintemplate>;
  ProgressByCurriculum?: Maybe<Array<Maybe<ProgressByCurriculum>>>;
  ProgressByUser?: Maybe<Array<Maybe<ProgressByUser>>>;
  ProgressFindMany: Array<progress>;
  ProgressFindOne?: Maybe<progress>;
  QuestionnairesFindByClass?: Maybe<Array<Maybe<questionnaires>>>;
  QuestionsFindMany?: Maybe<Array<Maybe<questions>>>;
  QuestionsFindOne?: Maybe<questions>;
  RegionFindMany: Array<region>;
  RegionFindOne?: Maybe<region>;
  ReportsFindMany: Array<reports>;
  ReportsFindOne?: Maybe<reports>;
  ResourcesCategoryCount?: Maybe<Array<Maybe<CategoryCount>>>;
  ResourcesCategoryFindMany: Array<resourcecategory>;
  ResourcesCategoryFindOne?: Maybe<resourcecategory>;
  ResourcesFindMany?: Maybe<Array<Maybe<resource>>>;
  ResourcesFindOne?: Maybe<resource>;
  ResourcesSearch?: Maybe<Array<Maybe<resource>>>;
  ResponsesFindMany: Array<responses>;
  ResponsesFindOne?: Maybe<responses>;
  SchoolByUsersFindMany?: Maybe<Array<Maybe<schoolsData>>>;
  SchoolCodeFindMany: Array<schoolcode>;
  SchoolCodeFindOne?: Maybe<schoolcode>;
  SchoolFindMany?: Maybe<Array<Maybe<schoolsData>>>;
  SchoolFindOne?: Maybe<schoolsData>;
  SchoolLevelFindMany: Array<schoollevel>;
  SchoolLevelFindOne?: Maybe<schoollevel>;
  SchoolSettingsFindMany: Array<schoolsettings>;
  SchoolSettingsFindOne?: Maybe<schoolsettings>;
  SchoolUserFindOne?: Maybe<schoolusers>;
  SchoolUserHistoryFindMany?: Maybe<Array<Maybe<DateUserCount>>>;
  SchoolUsersFindMany?: Maybe<Array<Maybe<UserShort>>>;
  ScoreFindOne?: Maybe<Score>;
  ScoreLessonFindOne?: Maybe<Score>;
  SkillSetFindMany: Array<skillset>;
  SkillSetFindOne?: Maybe<skillset>;
  StickerFindMany: Array<sticker>;
  StickerFindOne?: Maybe<sticker>;
  SubCategoriesFindMany: Array<subcategories>;
  SubCategoriesFindOne?: Maybe<subcategories>;
  SubscriptionsFindOne?: Maybe<subscription>;
  TapFindMany: Array<tap>;
  TapFindOne?: Maybe<tap>;
  TapTypeFindMany: Array<taptype>;
  TeacherClassAndStudents?: Maybe<ClassAndStudents>;
  TeacherCleverClassFindMany?: Maybe<Array<Maybe<CleverGroup>>>;
  ThemeFindMany: Array<theme>;
  ThemeFindOne?: Maybe<theme>;
  TotalUserMoodFindMany?: Maybe<TotalUserMood>;
  UserAnimalsFindOne?: Maybe<useranimals>;
  UserBadgesFindMany?: Maybe<Array<Maybe<userbadge>>>;
  UserBadgesFindOne?: Maybe<userbadge>;
  UserCollectiblesByCurriculumFindMany?: Maybe<Array<Maybe<collectible>>>;
  UserCollectiblesFindMany?: Maybe<Array<Maybe<usercollectibles>>>;
  UserDistrictFindOne?: Maybe<district>;
  UserInGroupsFindMany?: Maybe<Array<Maybe<usergroups>>>;
  UserMoodFindMany?: Maybe<Array<Maybe<usermood>>>;
  UserOrganizationMyInvitations?: Maybe<Array<Maybe<userorganization>>>;
  UserPinFindMany?: Maybe<Array<Maybe<userpin>>>;
  UserProgressByCurriculum?: Maybe<Array<Maybe<UserProgressByCurriculum>>>;
  UserSearch?: Maybe<UsersSearch>;
  UserStickerFindMany?: Maybe<Array<Maybe<usersticker>>>;
  UserTotalsDonationsFindMany?: Maybe<UsersTotalDonations>;
  UserTotalsFindMany?: Maybe<UsersTotal>;
  UserTypesFindMany: Array<usertypes>;
  UsersByOrganizationFindMany?: Maybe<UsersTotalObj>;
  UsersBySchoolFindMany?: Maybe<UsersTotalObj>;
  UsersFindMany?: Maybe<Array<Maybe<user>>>;
  UsersFindOne?: Maybe<user>;
  UsersSparksTotals?: Maybe<Array<Maybe<Sparks>>>;
  VaultByUserFindMany?: Maybe<VaultUserDonations>;
  VaultDonationTotal?: Maybe<VaultDonationTotal>;
  VaultFindMany?: Maybe<VaultDonations>;
  VideoSparkFindOne?: Maybe<videosparks>;
  VideoTapsFindMany: Array<videotap>;
  VideoTapsFindOne?: Maybe<videotap>;
  curriculumCollectionFindMany: Array<curriculumcollection>;
  curriculumCollectionFindOne?: Maybe<curriculumcollection>;
  narratorsFindMany: Array<narrators>;
  narratorsFindOne?: Maybe<narrators>;
  sparkLibraryFindMany: Array<sparklibrary>;
  userSparkLibraryFindMany: Array<sparklibraryuser>;
};


export type QueryAnimalsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyanimalsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyanimalsInput>;
};


export type QueryAnimalsFindOneArgs = {
  filter?: InputMaybe<FilterFindOneanimalsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneanimalsInput>;
};


export type QueryAnnouncementFindManyArgs = {
  filter?: InputMaybe<FilterFindManyannouncementInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyannouncementInput>;
};


export type QueryAnnouncementFindOneArgs = {
  filter?: InputMaybe<FilterFindOneannouncementInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneannouncementInput>;
};


export type QueryAvatarFindManyArgs = {
  filter?: InputMaybe<FilterFindManyavatarInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyavatarInput>;
};


export type QueryAvatarFindOneArgs = {
  filter?: InputMaybe<FilterFindOneavatarInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneavatarInput>;
};


export type QueryAvatarTypesFindManyArgs = {
  filter?: InputMaybe<FilterFindManyavatartypesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyavatartypesInput>;
};


export type QueryBadgesFindManyArgs = {
  filter?: InputMaybe<FilterFindManybadgesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManybadgesInput>;
};


export type QueryBadgesFindOneArgs = {
  filter?: InputMaybe<FilterFindOnebadgesInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnebadgesInput>;
};


export type QueryBillingTypesFindManyArgs = {
  filter?: InputMaybe<FilterFindManybillingtypesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManybillingtypesInput>;
};


export type QueryCardFindManyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCategoriesFindManyArgs = {
  filter?: InputMaybe<FilterFindManycategoriesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManycategoriesInput>;
};


export type QueryCategoriesFindOneArgs = {
  filter?: InputMaybe<FilterFindOnecategoriesInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnecategoriesInput>;
};


export type QueryCheckInQuestionFindManyArgs = {
  filter?: InputMaybe<FilterFindManycheckinquestionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManycheckinquestionInput>;
};


export type QueryCheckInQuestionFindOneArgs = {
  filter?: InputMaybe<FilterFindOnecheckinquestionInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnecheckinquestionInput>;
};


export type QueryCheckInUserAnswerFindManyArgs = {
  filter?: InputMaybe<checkinuseranswerInput>;
};


export type QueryCheckInUserAnswerFindOneArgs = {
  filter?: InputMaybe<checkinuseranswerInput>;
};


export type QueryClassJournalsFindManyArgs = {
  class: Scalars['String']['input'];
  scale?: InputMaybe<Scalars['String']['input']>;
};


export type QueryClassLikeMineArgs = {
  class: Scalars['String']['input'];
};


export type QueryClassLikesCountArgs = {
  filter?: InputMaybe<FilterCountclasslikeInput>;
};


export type QueryClassLikesFindManyArgs = {
  filter?: InputMaybe<FilterFindManyclasslikeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyclasslikeInput>;
};


export type QueryClassesAdminFindManyArgs = {
  filter?: InputMaybe<FilterFindManyclassesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortFindManyclassesInput>>;
};


export type QueryClassesAdminFindOneArgs = {
  filter?: InputMaybe<FilterFindOneclassesInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneclassesInput>;
};


export type QueryClassesByCurriculumFindOneArgs = {
  curriculum: Scalars['String']['input'];
};


export type QueryClassesFindOneArgs = {
  _id: Scalars['String']['input'];
};


export type QueryClassificationTypeFindManyArgs = {
  filter?: InputMaybe<FilterFindManyclassificationtypeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyclassificationtypeInput>;
};


export type QueryClassificationTypeFindOneArgs = {
  filter?: InputMaybe<FilterFindOneclassificationtypeInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneclassificationtypeInput>;
};


export type QueryCollectiblesByCurriculumFindManyArgs = {
  curriculum: Scalars['String']['input'];
};


export type QueryCollectiblesFindManyArgs = {
  filter?: InputMaybe<collectibleInput>;
};


export type QueryCollectiblesFindOneArgs = {
  filter?: InputMaybe<collectibleInput>;
};


export type QueryCurriculumCategoryFindManyArgs = {
  filter?: InputMaybe<FilterFindManycurriculumcategoryInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManycurriculumcategoryInput>;
};


export type QueryCurriculumCategoryFindOneArgs = {
  filter?: InputMaybe<FilterFindOnecurriculumcategoryInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnecurriculumcategoryInput>;
};


export type QueryCurriculumsByUserArgs = {
  user: Scalars['String']['input'];
};


export type QueryCurriculumsFindManyArgs = {
  filter?: InputMaybe<curriculumsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<curriculumsSortEnum>;
};


export type QueryCurriculumsFindOneArgs = {
  filter?: InputMaybe<curriculumsInput>;
};


export type QueryDistrictFindManyArgs = {
  filter?: InputMaybe<FilterFindManydistrictInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManydistrictInput>;
};


export type QueryDistrictFindOneArgs = {
  filter?: InputMaybe<FilterFindOnedistrictInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnedistrictInput>;
};


export type QueryDistrictProfileFindManyArgs = {
  filter?: InputMaybe<FilterFindManydistrictprofileInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManydistrictprofileInput>;
};


export type QueryDistrictProfileFindOneArgs = {
  filter?: InputMaybe<FilterFindOnedistrictprofileInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnedistrictprofileInput>;
};


export type QueryFavoritesFindManyArgs = {
  filter?: InputMaybe<favoritesInput>;
};


export type QueryFeedbackFindManyArgs = {
  filter?: InputMaybe<FilterFindManyfeedbackInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyfeedbackInput>;
};


export type QueryFeedbackFindOneArgs = {
  filter?: InputMaybe<FilterFindOnefeedbackInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnefeedbackInput>;
};


export type QueryGlobalProgressGenerateOneArgs = {
  curriculum: Scalars['String']['input'];
  group: Scalars['String']['input'];
};


export type QueryGradesFindManyArgs = {
  filter?: InputMaybe<FilterFindManygradeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManygradeInput>;
};


export type QueryGradesFindOneArgs = {
  filter?: InputMaybe<FilterFindOnegradeInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnegradeInput>;
};


export type QueryGroupFindManyArgs = {
  filter?: InputMaybe<groupsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGroupFindOneArgs = {
  filter?: InputMaybe<groupsInput>;
};


export type QueryGroupJournalsFindManyArgs = {
  group: Scalars['String']['input'];
  lesson: Scalars['String']['input'];
};


export type QueryGroupProgressByOrganizationFindManyArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  organization: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGroupProgressFindManyArgs = {
  filter?: InputMaybe<groupprogressInput>;
};


export type QueryGroupProgressFindOneArgs = {
  filter?: InputMaybe<groupprogressInput>;
};


export type QueryImpactFindManyArgs = {
  filter?: InputMaybe<FilterFindManyimpactInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyimpactInput>;
};


export type QueryImpactFindOneArgs = {
  filter?: InputMaybe<FilterFindOneimpactInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneimpactInput>;
};


export type QueryInfluencesFindOneArgs = {
  filter?: InputMaybe<userInput>;
};


export type QueryJournalsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyjournalsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyjournalsInput>;
};


export type QueryJournalsFindOneArgs = {
  filter?: InputMaybe<FilterFindOnejournalsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnejournalsInput>;
};


export type QueryLessonFindManyArgs = {
  filter?: InputMaybe<lessonInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<lessonSortEnumTC>;
};


export type QueryLessonFindOneArgs = {
  filter?: InputMaybe<lessonInput>;
};


export type QueryLicensePresetFindManyArgs = {
  filter?: InputMaybe<FilterFindManylicensepresetInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManylicensepresetInput>;
};


export type QueryLicensePresetFindOneArgs = {
  filter?: InputMaybe<FilterFindOnelicensepresetInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnelicensepresetInput>;
};


export type QueryLifeSkillFindManyArgs = {
  filter?: InputMaybe<FilterFindManylifeskillInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManylifeskillInput>;
};


export type QueryLifeSkillFindOneArgs = {
  filter?: InputMaybe<FilterFindOnelifeskillInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnelifeskillInput>;
};


export type QueryMoodCategoryFindManyArgs = {
  filter?: InputMaybe<FilterFindManymoodcategoryInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManymoodcategoryInput>;
};


export type QueryMoodCategoryFindOneArgs = {
  filter?: InputMaybe<FilterFindOnemoodcategoryInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnemoodcategoryInput>;
};


export type QueryMoodFindManyArgs = {
  filter?: InputMaybe<FilterFindManymoodInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManymoodInput>;
};


export type QueryMoodFindOneArgs = {
  filter?: InputMaybe<FilterFindOnemoodInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnemoodInput>;
};


export type QueryOrganizationTokenFindManyArgs = {
  filter?: InputMaybe<FilterFindManyorganizationtokenInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyorganizationtokenInput>;
};


export type QueryOrganizationTokenFindOneArgs = {
  filter?: InputMaybe<FilterFindOneorganizationtokenInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneorganizationtokenInput>;
};


export type QueryOrganizationUserHistoryFindManyArgs = {
  dateField: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrganizationsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyorganizationInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyorganizationInput>;
};


export type QueryParentChildFindManyArgs = {
  filter?: InputMaybe<FilterFindManyparentchildrenInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyparentchildrenInput>;
};


export type QueryPinFindManyArgs = {
  filter?: InputMaybe<FilterFindManypinInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManypinInput>;
};


export type QueryPinFindOneArgs = {
  filter?: InputMaybe<FilterFindOnepinInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnepinInput>;
};


export type QueryPinTemplateFindManyArgs = {
  filter?: InputMaybe<FilterFindManypintemplateInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManypintemplateInput>;
};


export type QueryPinTemplateFindOneArgs = {
  filter?: InputMaybe<FilterFindOnepintemplateInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnepintemplateInput>;
};


export type QueryProgressByCurriculumArgs = {
  _id: Scalars['String']['input'];
};


export type QueryProgressByUserArgs = {
  code: Scalars['String']['input'];
  user: Scalars['String']['input'];
};


export type QueryProgressFindManyArgs = {
  filter?: InputMaybe<FilterFindManyprogressInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyprogressInput>;
};


export type QueryProgressFindOneArgs = {
  filter?: InputMaybe<FilterFindOneprogressInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneprogressInput>;
};


export type QueryQuestionnairesFindByClassArgs = {
  class: Scalars['String']['input'];
};


export type QueryQuestionsFindManyArgs = {
  filter?: InputMaybe<questionsInput>;
  sort?: InputMaybe<questionsSortEnum>;
};


export type QueryQuestionsFindOneArgs = {
  filter?: InputMaybe<questionsInput>;
  sort?: InputMaybe<questionsSortEnum>;
};


export type QueryRegionFindManyArgs = {
  filter?: InputMaybe<FilterFindManyregionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyregionInput>;
};


export type QueryRegionFindOneArgs = {
  filter?: InputMaybe<FilterFindOneregionInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneregionInput>;
};


export type QueryReportsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyreportsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyreportsInput>;
};


export type QueryReportsFindOneArgs = {
  filter?: InputMaybe<FilterFindOnereportsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnereportsInput>;
};


export type QueryResourcesCategoryFindManyArgs = {
  filter?: InputMaybe<FilterFindManyresourcecategoryInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyresourcecategoryInput>;
};


export type QueryResourcesCategoryFindOneArgs = {
  filter?: InputMaybe<FilterFindOneresourcecategoryInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneresourcecategoryInput>;
};


export type QueryResourcesFindManyArgs = {
  filter?: InputMaybe<resourceInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryResourcesFindOneArgs = {
  filter?: InputMaybe<resourceInput>;
};


export type QueryResourcesSearchArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  query: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryResponsesFindManyArgs = {
  filter?: InputMaybe<FilterFindManyresponsesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyresponsesInput>;
};


export type QueryResponsesFindOneArgs = {
  filter?: InputMaybe<FilterFindOneresponsesInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneresponsesInput>;
};


export type QuerySchoolByUsersFindManyArgs = {
  user?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySchoolCodeFindManyArgs = {
  filter?: InputMaybe<FilterFindManyschoolcodeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyschoolcodeInput>;
};


export type QuerySchoolCodeFindOneArgs = {
  filter?: InputMaybe<FilterFindOneschoolcodeInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneschoolcodeInput>;
};


export type QuerySchoolFindManyArgs = {
  filter?: InputMaybe<schoolsDataInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySchoolFindOneArgs = {
  filter?: InputMaybe<schoolsDataInput>;
};


export type QuerySchoolLevelFindManyArgs = {
  filter?: InputMaybe<FilterFindManyschoollevelInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyschoollevelInput>;
};


export type QuerySchoolLevelFindOneArgs = {
  filter?: InputMaybe<FilterFindOneschoollevelInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneschoollevelInput>;
};


export type QuerySchoolSettingsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyschoolsettingsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyschoolsettingsInput>;
};


export type QuerySchoolSettingsFindOneArgs = {
  filter?: InputMaybe<FilterFindOneschoolsettingsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneschoolsettingsInput>;
};


export type QuerySchoolUserFindOneArgs = {
  filter?: InputMaybe<schoolusersInput>;
};


export type QuerySchoolUserHistoryFindManyArgs = {
  dateField: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  school: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySchoolUsersFindManyArgs = {
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryScoreFindOneArgs = {
  class: Scalars['String']['input'];
};


export type QueryScoreLessonFindOneArgs = {
  lesson: Scalars['String']['input'];
};


export type QuerySkillSetFindManyArgs = {
  filter?: InputMaybe<FilterFindManyskillsetInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyskillsetInput>;
};


export type QuerySkillSetFindOneArgs = {
  filter?: InputMaybe<FilterFindOneskillsetInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneskillsetInput>;
};


export type QueryStickerFindManyArgs = {
  filter?: InputMaybe<FilterFindManystickerInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManystickerInput>;
};


export type QueryStickerFindOneArgs = {
  filter?: InputMaybe<FilterFindOnestickerInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnestickerInput>;
};


export type QuerySubCategoriesFindManyArgs = {
  filter?: InputMaybe<FilterFindManysubcategoriesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManysubcategoriesInput>;
};


export type QuerySubCategoriesFindOneArgs = {
  filter?: InputMaybe<FilterFindOnesubcategoriesInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnesubcategoriesInput>;
};


export type QuerySubscriptionsFindOneArgs = {
  filter?: InputMaybe<FilterFindOnesubscriptionInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnesubscriptionInput>;
};


export type QueryTapFindManyArgs = {
  filter?: InputMaybe<FilterFindManytapInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManytapInput>;
};


export type QueryTapFindOneArgs = {
  filter?: InputMaybe<tapInput>;
};


export type QueryTapTypeFindManyArgs = {
  filter?: InputMaybe<FilterFindManytaptypeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManytaptypeInput>;
};


export type QueryTeacherClassAndStudentsArgs = {
  user?: InputMaybe<Scalars['String']['input']>;
};


export type QueryThemeFindManyArgs = {
  filter?: InputMaybe<FilterFindManythemeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManythemeInput>;
};


export type QueryThemeFindOneArgs = {
  filter?: InputMaybe<FilterFindOnethemeInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnethemeInput>;
};


export type QueryTotalUserMoodFindManyArgs = {
  group?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserAnimalsFindOneArgs = {
  filter: FilterFindOneuseranimalsInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOneuseranimalsInput>;
};


export type QueryUserBadgesFindManyArgs = {
  filter?: InputMaybe<userbadgeInput>;
};


export type QueryUserBadgesFindOneArgs = {
  filter?: InputMaybe<userbadgeInput>;
};


export type QueryUserCollectiblesByCurriculumFindManyArgs = {
  curriculum: Scalars['String']['input'];
};


export type QueryUserCollectiblesFindManyArgs = {
  collectible?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserInGroupsFindManyArgs = {
  filter?: InputMaybe<usergroupsInput>;
};


export type QueryUserMoodFindManyArgs = {
  endTime?: InputMaybe<Scalars['String']['input']>;
  mood?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserPinFindManyArgs = {
  filter?: InputMaybe<userpinInput>;
};


export type QueryUserProgressByCurriculumArgs = {
  _id: Scalars['String']['input'];
};


export type QueryUserSearchArgs = {
  districtId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  platformId?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  schoolId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserStickerFindManyArgs = {
  filter?: InputMaybe<userstickerInput>;
};


export type QueryUserTotalsDonationsFindManyArgs = {
  group?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserTotalsFindManyArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  global?: InputMaybe<Scalars['Boolean']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserTypesFindManyArgs = {
  filter?: InputMaybe<FilterFindManyusertypesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyusertypesInput>;
};


export type QueryUsersByOrganizationFindManyArgs = {
  lastLogin?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organization: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersBySchoolFindManyArgs = {
  lastLogin?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  school: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersFindManyArgs = {
  filter?: InputMaybe<userInput>;
};


export type QueryUsersFindOneArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersSparksTotalsArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  global?: InputMaybe<Scalars['Boolean']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVaultByUserFindManyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVaultDonationTotalArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVaultFindManyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVideoSparkFindOneArgs = {
  filter?: InputMaybe<FilterFindOnevideosparksInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnevideosparksInput>;
};


export type QueryVideoTapsFindManyArgs = {
  filter?: InputMaybe<FilterFindManyvideotapInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyvideotapInput>;
};


export type QueryVideoTapsFindOneArgs = {
  filter?: InputMaybe<FilterFindOnevideotapInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnevideotapInput>;
};


export type QuerycurriculumCollectionFindManyArgs = {
  filter?: InputMaybe<FilterFindManycurriculumcollectionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManycurriculumcollectionInput>;
};


export type QuerycurriculumCollectionFindOneArgs = {
  filter?: InputMaybe<FilterFindOnecurriculumcollectionInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnecurriculumcollectionInput>;
};


export type QuerynarratorsFindManyArgs = {
  filter?: InputMaybe<FilterFindManynarratorsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManynarratorsInput>;
};


export type QuerynarratorsFindOneArgs = {
  filter?: InputMaybe<FilterFindOnenarratorsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindOnenarratorsInput>;
};


export type QuerysparkLibraryFindManyArgs = {
  filter?: InputMaybe<FilterFindManysparklibraryInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManysparklibraryInput>;
};


export type QueryuserSparkLibraryFindManyArgs = {
  filter?: InputMaybe<FilterFindManysparklibraryuserInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManysparklibraryuserInput>;
};

export type Question = {
  __typename?: 'Question';
  group?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type QuestionInput = {
  /** The answer _id */
  answer?: InputMaybe<Scalars['String']['input']>;
  /** The question _id */
  question?: InputMaybe<Scalars['String']['input']>;
};

export type QuestionnaireProgressCheck = {
  __typename?: 'QuestionnaireProgressCheck';
  badge?: Maybe<badgeMedia>;
  questionnaire?: Maybe<questionnaires>;
};

export type QuestionsObjTC = {
  __typename?: 'QuestionsObjTC';
  _id: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  label: Scalars['String']['output'];
  labelHtml: Scalars['String']['output'];
  language?: Maybe<languageTC>;
  responses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  rightAnswers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ResponseResult = {
  __typename?: 'ResponseResult';
  _id?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
};

export type SchoolLevelObjTC = {
  __typename?: 'SchoolLevelObjTC';
  _id?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
};

export type Score = {
  __typename?: 'Score';
  check?: Maybe<Array<Maybe<Score_Check>>>;
  explore?: Maybe<Array<Maybe<Score_Explore>>>;
};

export type Score_Check = {
  __typename?: 'Score_Check';
  done?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  right?: Maybe<Scalars['Boolean']['output']>;
};

export type Score_Explore = {
  __typename?: 'Score_Explore';
  done?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export enum SortFindManyanimalsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyannouncementInput {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyavatarInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyavatartypesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManybadgesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManybillingtypesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManycategoriesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManycheckinquestionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyclassesInput {
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyclassificationtypeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyclasslikeInput {
  TEACHER_ASC = 'TEACHER_ASC',
  TEACHER_DESC = 'TEACHER_DESC',
  TEACHER__CLASS_ASC = 'TEACHER__CLASS_ASC',
  TEACHER__CLASS_DESC = 'TEACHER__CLASS_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManycurriculumcategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManycurriculumcollectionInput {
  SLUG_ASC = 'SLUG_ASC',
  SLUG_DESC = 'SLUG_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManydistrictInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManydistrictprofileInput {
  DISTRICT_ASC = 'DISTRICT_ASC',
  DISTRICT_DESC = 'DISTRICT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyfeedbackInput {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManygradeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyimpactInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyjournalsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManylicensepresetInput {
  IDENTIFIER_ASC = 'IDENTIFIER_ASC',
  IDENTIFIER_DESC = 'IDENTIFIER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManylifeskillInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManymoodInput {
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManymoodcategoryInput {
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManynarratorsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyorganizationInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyorganizationtokenInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyparentchildrenInput {
  CHILD_ASC = 'CHILD_ASC',
  CHILD_DESC = 'CHILD_DESC',
  CHILD__SLOT_ASC = 'CHILD__SLOT_ASC',
  CHILD__SLOT_DESC = 'CHILD__SLOT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManypinInput {
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManypintemplateInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyprogressInput {
  DELETEDAT_ASC = 'DELETEDAT_ASC',
  DELETEDAT_DESC = 'DELETEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyregionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyreportsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyresourcecategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyresponsesInput {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyschoolcodeInput {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyschoollevelInput {
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyschoolsettingsInput {
  SCHOOL_ASC = 'SCHOOL_ASC',
  SCHOOL_DESC = 'SCHOOL_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyskillsetInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManysparklibraryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManysparklibraryuserInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManystickerInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManysubcategoriesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManytapInput {
  CLASS_ASC = 'CLASS_ASC',
  CLASS_DESC = 'CLASS_DESC',
  LESSON_ASC = 'LESSON_ASC',
  LESSON_DESC = 'LESSON_DESC',
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  SLUG_ASC = 'SLUG_ASC',
  SLUG_DESC = 'SLUG_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManytaptypeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManythemeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyusertypesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindManyvideotapInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneanimalsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneannouncementInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneavatarInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnebadgesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnecategoriesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnecheckinquestionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneclassesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneclassificationtypeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnecurriculumcategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnecurriculumcollectionInput {
  SLUG_ASC = 'SLUG_ASC',
  SLUG_DESC = 'SLUG_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnedistrictInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnedistrictprofileInput {
  DISTRICT_ASC = 'DISTRICT_ASC',
  DISTRICT_DESC = 'DISTRICT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnefeedbackInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnegradeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneimpactInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnejournalsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnelicensepresetInput {
  IDENTIFIER_ASC = 'IDENTIFIER_ASC',
  IDENTIFIER_DESC = 'IDENTIFIER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnelifeskillInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnemoodInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnemoodcategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnenarratorsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneorganizationtokenInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnepinInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnepintemplateInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneprogressInput {
  DELETEDAT_ASC = 'DELETEDAT_ASC',
  DELETEDAT_DESC = 'DELETEDAT_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneregionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnereportsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneresourcecategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneresponsesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneschoolcodeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneschoollevelInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneschoolsettingsInput {
  SCHOOL_ASC = 'SCHOOL_ASC',
  SCHOOL_DESC = 'SCHOOL_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneskillsetInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnestickerInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnesubcategoriesInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnesubscriptionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnethemeInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOneuseranimalsInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnevideosparksInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortFindOnevideotapInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateManypinInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateOnecheckinquestionInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateOnecheckinuseranswerInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateOnecurriculumcategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateOneresourcecategoryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export enum SortUpdateOnesparklibraryInput {
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export type SparkResponseResultTC = {
  __typename?: 'SparkResponseResultTC';
  pin?: Maybe<Scalars['String']['output']>;
  responses?: Maybe<Array<Maybe<ResponseResult>>>;
};

export type Sparks = {
  __typename?: 'Sparks';
  dailyPoints?: Maybe<Scalars['Float']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  monthlyPoints?: Maybe<Scalars['Float']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  week?: Maybe<Scalars['Float']['output']>;
  weeklyPoints?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newJournalResponse?: Maybe<Question>;
  newQuestionResponse?: Maybe<Question>;
};


export type SubscriptionnewJournalResponseArgs = {
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionnewQuestionResponseArgs = {
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
};

export type TotalUserMood = {
  __typename?: 'TotalUserMood';
  total?: Maybe<Scalars['Float']['output']>;
  users?: Maybe<Array<Maybe<TotalUserMood_Users>>>;
};

export type TotalUserMood_Users = {
  __typename?: 'TotalUserMood_Users';
  mood?: Maybe<TotalUserMood_Users_Mood>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type TotalUserMood_Users_Mood = {
  __typename?: 'TotalUserMood_Users_Mood';
  _id?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['String']['output']>;
  tips?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type UpdateByIdanimalsInput = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  levels?: InputMaybe<Array<InputMaybe<UpdateByIdanimalsLevelsInput>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdanimalsLevelsImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdanimalsLevelsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<UpdateByIdanimalsLevelsImageInput>;
  level?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateByIdanimalsPayload = {
  __typename?: 'UpdateByIdanimalsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<animals>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdanimalscategoriesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdanimalscategoriesPayload = {
  __typename?: 'UpdateByIdanimalscategoriesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<animalscategories>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdannouncementInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdannouncementPayload = {
  __typename?: 'UpdateByIdannouncementPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<announcement>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdbadgesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdbadgesInput = {
  cover?: InputMaybe<UpdateByIdbadgesCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<UpdateByIdbadgesVideoInput>;
};

export type UpdateByIdbadgesPayload = {
  __typename?: 'UpdateByIdbadgesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<badges>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdbadgesVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesBackgroundInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesDiscussionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesExtendInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesExtracurricularInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesInput = {
  activity?: InputMaybe<Array<InputMaybe<UpdateByIdclassesActivityInput>>>;
  background?: InputMaybe<UpdateByIdclassesBackgroundInput>;
  bigIdea?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<UpdateByIdclassesCoverInput>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discussion?: InputMaybe<Array<InputMaybe<UpdateByIdclassesDiscussionInput>>>;
  documents?: InputMaybe<Array<InputMaybe<UpdateByIdclassesDocumentsInput>>>;
  extend?: InputMaybe<Array<InputMaybe<UpdateByIdclassesExtendInput>>>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  extraActivities?: InputMaybe<Scalars['String']['input']>;
  extracurricular?: InputMaybe<UpdateByIdclassesExtracurricularInput>;
  feedback?: InputMaybe<Scalars['Boolean']['input']>;
  free?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<UpdateByIdclassesLanguageInput>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  overview?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  reflection?: InputMaybe<Array<InputMaybe<UpdateByIdclassesReflectionInput>>>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  trailer?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateByIdclassesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<UpdateByIdclassesLanguageEnglishInput>;
  french?: InputMaybe<UpdateByIdclassesLanguageFrenchInput>;
  spanish?: InputMaybe<UpdateByIdclassesLanguageSpanishInput>;
};

export type UpdateByIdclassesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassesPayload = {
  __typename?: 'UpdateByIdclassesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<classes>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdclassesReflectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdclassificationtypeInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdclassificationtypePayload = {
  __typename?: 'UpdateByIdclassificationtypePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<classificationtype>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdcurriculumsBgImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  animalCategory?: InputMaybe<Scalars['String']['input']>;
  bgImage?: InputMaybe<UpdateByIdcurriculumsBgImageInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  courseDuration?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<UpdateByIdcurriculumsCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculumCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  documents?: InputMaybe<Array<InputMaybe<UpdateByIdcurriculumsDocumentsInput>>>;
  donation?: InputMaybe<Scalars['Boolean']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<UpdateByIdcurriculumsLanguageInput>;
  leaderBio?: InputMaybe<Scalars['String']['input']>;
  leaderName?: InputMaybe<Scalars['String']['input']>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logo?: InputMaybe<UpdateByIdcurriculumsLogoInput>;
  loop?: InputMaybe<UpdateByIdcurriculumsLoopInput>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  pacingGuide?: InputMaybe<UpdateByIdcurriculumsPacingGuideInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  resources?: InputMaybe<Array<InputMaybe<UpdateByIdcurriculumsResourcesInput>>>;
  schoolLevel?: InputMaybe<Scalars['String']['input']>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  totalClass?: InputMaybe<Scalars['Float']['input']>;
  totalLesson?: InputMaybe<Scalars['Float']['input']>;
  totalLessonRestricted?: InputMaybe<Scalars['Float']['input']>;
  trailer?: InputMaybe<UpdateByIdcurriculumsTrailerInput>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdcurriculumsLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<UpdateByIdcurriculumsLanguageEnglishInput>;
  french?: InputMaybe<UpdateByIdcurriculumsLanguageFrenchInput>;
  spanish?: InputMaybe<UpdateByIdcurriculumsLanguageSpanishInput>;
};

export type UpdateByIdcurriculumsLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsLoopInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsPacingGuideInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsPayload = {
  __typename?: 'UpdateByIdcurriculumsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<curriculums>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdcurriculumsResourcesInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsTrailerCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsTrailerCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<UpdateByIdcurriculumsTrailerCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdcurriculumsTrailerInput = {
  captions?: InputMaybe<Array<InputMaybe<UpdateByIdcurriculumsTrailerCaptionsInput>>>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIddistrictCoverPhotoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIddistrictInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coverPhoto?: InputMaybe<UpdateByIddistrictCoverPhotoInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<UpdateByIddistrictLogoInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  schoolLicense?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userTotal?: InputMaybe<Scalars['Float']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIddistrictLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIddistrictPayload = {
  __typename?: 'UpdateByIddistrictPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<district>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdfeedbackInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdfeedbackPayload = {
  __typename?: 'UpdateByIdfeedbackPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<feedback>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdimpactCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdimpactInput = {
  cover?: InputMaybe<UpdateByIdimpactCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdimpactPayload = {
  __typename?: 'UpdateByIdimpactPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<impact>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdlessonCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdlessonInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  classificationType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cover?: InputMaybe<UpdateByIdlessonCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdlessonPayload = {
  __typename?: 'UpdateByIdlessonPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<lesson>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdlicensepresetInput = {
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdlicensepresetPayload = {
  __typename?: 'UpdateByIdlicensepresetPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<licensepreset>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdlifeskillIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdlifeskillInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<UpdateByIdlifeskillIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdlifeskillPayload = {
  __typename?: 'UpdateByIdlifeskillPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<lifeskill>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdmoodcategoryInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdmoodcategoryPayload = {
  __typename?: 'UpdateByIdmoodcategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<moodcategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdnarratorsAvatarInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdnarratorsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<UpdateByIdnarratorsAvatarInput>;
  bio?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdnarratorsPayload = {
  __typename?: 'UpdateByIdnarratorsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<narrators>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdorganizationtokenInput = {
  cleverDistrictId?: InputMaybe<Scalars['String']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  oneRosterAppId?: InputMaybe<Scalars['String']['input']>;
  oneRosterToken?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdorganizationtokenPayload = {
  __typename?: 'UpdateByIdorganizationtokenPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<organizationtoken>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdpintemplateCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdpintemplateInput = {
  cover?: InputMaybe<UpdateByIdpintemplateCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<UpdateByIdpintemplateVideoInput>;
};

export type UpdateByIdpintemplatePayload = {
  __typename?: 'UpdateByIdpintemplatePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<pintemplate>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdpintemplateVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdquestionsInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  labelHtml?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<UpdateByIdquestionsLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  responses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  rightAnswers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdquestionsLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdquestionsLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdquestionsLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<UpdateByIdquestionsLanguageEnglishInput>;
  french?: InputMaybe<UpdateByIdquestionsLanguageFrenchInput>;
  spanish?: InputMaybe<UpdateByIdquestionsLanguageSpanishInput>;
};

export type UpdateByIdquestionsLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdquestionsPayload = {
  __typename?: 'UpdateByIdquestionsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<questions>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdregionInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  exemptionDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdregionPayload = {
  __typename?: 'UpdateByIdregionPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<region>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdreportsInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdreportsPayload = {
  __typename?: 'UpdateByIdreportsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<reports>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdresourceFileInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdresourceInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<UpdateByIdresourceFileInput>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  metaKey?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  tap?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdresourcePayload = {
  __typename?: 'UpdateByIdresourcePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<resource>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdresponsesInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<UpdateByIdresponsesLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdresponsesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdresponsesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdresponsesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<UpdateByIdresponsesLanguageEnglishInput>;
  french?: InputMaybe<UpdateByIdresponsesLanguageFrenchInput>;
  spanish?: InputMaybe<UpdateByIdresponsesLanguageSpanishInput>;
};

export type UpdateByIdresponsesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdresponsesPayload = {
  __typename?: 'UpdateByIdresponsesPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<responses>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdschoolcodeInput = {
  classes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  expirationDate?: InputMaybe<Scalars['Date']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdschoolcodePayload = {
  __typename?: 'UpdateByIdschoolcodePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<schoolcode>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdschoollevelInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdschoollevelPayload = {
  __typename?: 'UpdateByIdschoollevelPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<schoollevel>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdschoolsDataInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  cleverSync?: InputMaybe<Scalars['Boolean']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  partnerCenterId?: InputMaybe<Scalars['String']['input']>;
  partnerProvider?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdschoolsDataPayload = {
  __typename?: 'UpdateByIdschoolsDataPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<schoolsData>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdschoolsettingsInput = {
  accessWithClassLink?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithClever?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithEmail?: InputMaybe<Scalars['Boolean']['input']>;
  accessWithGoogle?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  restrictions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdschoolsettingsPayload = {
  __typename?: 'UpdateByIdschoolsettingsPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<schoolsettings>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdskillsetIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdskillsetInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<UpdateByIdskillsetIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdskillsetPayload = {
  __typename?: 'UpdateByIdskillsetPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<skillset>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdstickerCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdstickerInput = {
  cover?: InputMaybe<UpdateByIdstickerCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyVault?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<UpdateByIdstickerVideoInput>;
};

export type UpdateByIdstickerPayload = {
  __typename?: 'UpdateByIdstickerPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<sticker>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdstickerVideoInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapCanvaInput = {
  ratio?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapExtraQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapInput = {
  additional?: InputMaybe<Scalars['String']['input']>;
  canva?: InputMaybe<Array<InputMaybe<UpdateByIdtapCanvaInput>>>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<UpdateByIdtapCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  donation?: InputMaybe<Scalars['Float']['input']>;
  donationVault?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  extraQuestions?: InputMaybe<Array<InputMaybe<UpdateByIdtapExtraQuestionsInput>>>;
  intro?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  lifeSkills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<InputMaybe<UpdateByIdtapQuestionsInput>>>;
  resources?: InputMaybe<Array<InputMaybe<UpdateByIdtapResourcesInput>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  themes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  videos?: InputMaybe<Array<InputMaybe<UpdateByIdtapVideosInput>>>;
};

export type UpdateByIdtapPayload = {
  __typename?: 'UpdateByIdtapPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<tap>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIdtapQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapResourcesInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapVideosCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapVideosCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<UpdateByIdtapVideosCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapVideosInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  captions?: InputMaybe<Array<InputMaybe<UpdateByIdtapVideosCaptionsInput>>>;
  narrator?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<UpdateByIdtapVideosThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdtapVideosThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdthemeIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdthemeInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<UpdateByIdthemeIconInput>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdthemePayload = {
  __typename?: 'UpdateByIdthemePayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<theme>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIduserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  birthday?: InputMaybe<Scalars['Date']['input']>;
  classLinkId?: InputMaybe<Scalars['String']['input']>;
  classLinkSync?: InputMaybe<Scalars['Boolean']['input']>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  cleverSync?: InputMaybe<Scalars['Boolean']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyAuthenticationToken?: InputMaybe<Scalars['String']['input']>;
  deedlyUserId?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastLogin?: InputMaybe<Scalars['Date']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  mfaCode?: InputMaybe<Scalars['String']['input']>;
  mfaCodeExpiry?: InputMaybe<Scalars['Date']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  partnerProvider?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<UpdateByIduserProfilePictureInput>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIduserPayload = {
  __typename?: 'UpdateByIduserPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<user>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateByIduserProfilePictureInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateByIdvideotapInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  end?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Float']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateByIdvideotapPayload = {
  __typename?: 'UpdateByIdvideotapPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<videotap>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateManypinCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateManypinInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<UpdateManypinCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<UpdateManypinVideoInput>;
};

export type UpdateManypinPayload = {
  __typename?: 'UpdateManypinPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']['output']>;
};

export type UpdateManypinVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnecheckinquestionInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateOnecheckinquestionPayload = {
  __typename?: 'UpdateOnecheckinquestionPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<checkinquestion>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateOnecheckinuseranswerInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  checkinQuestion?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnecheckinuseranswerPayload = {
  __typename?: 'UpdateOnecheckinuseranswerPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<checkinuseranswer>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateOnecurriculumcategoryInput = {
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateOnecurriculumcategoryPayload = {
  __typename?: 'UpdateOnecurriculumcategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<curriculumcategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateOneresourcecategoryIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOneresourcecategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<UpdateOneresourcecategoryIconInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateOneresourcecategoryPayload = {
  __typename?: 'UpdateOneresourcecategoryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<resourcecategory>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateOnesparklibraryArticleInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryArticleQuestionInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryFunFactInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryInput = {
  article?: InputMaybe<UpdateOnesparklibraryArticleInput>;
  articleBody?: InputMaybe<Scalars['String']['input']>;
  articleQuestion?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryArticleQuestionInput>>>;
  articleTitle?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<UpdateOnesparklibraryCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  funFact?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryFunFactInput>>>;
  journals?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryJournalsInput>>>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  mindfulMoment?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryMindfulMomentInput>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  takeAwayDescription?: InputMaybe<Scalars['String']['input']>;
  takeAwayLabel?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<UpdateOnesparklibraryVideoInput>;
  videoQuestions?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryVideoQuestionsInput>>>;
};

export type UpdateOnesparklibraryJournalsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryMindfulMomentInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryPayload = {
  __typename?: 'UpdateOnesparklibraryPayload';
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
  /** Updated document */
  record?: Maybe<sparklibrary>;
  /** Document ID */
  recordId?: Maybe<Scalars['String']['output']>;
};

export type UpdateOnesparklibraryVideoCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryVideoCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<UpdateOnesparklibraryVideoCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryVideoInput = {
  captions?: InputMaybe<Array<InputMaybe<UpdateOnesparklibraryVideoCaptionsInput>>>;
  thumbnail?: InputMaybe<UpdateOnesparklibraryVideoThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryVideoQuestionsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnesparklibraryVideoThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UserMedia = {
  __typename?: 'UserMedia';
  _id?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type UserProgressByCurriculum = {
  __typename?: 'UserProgressByCurriculum';
  count?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserProgressByCurriculum_User>;
};

export type UserProgressByCurriculum_User = {
  __typename?: 'UserProgressByCurriculum_User';
  _id?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type UserShort = {
  __typename?: 'UserShort';
  _id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastLogin: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type UserWithSchool = {
  __typename?: 'UserWithSchool';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  curriculums?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<UserWithSchool_Groups>>>;
  lastLogin?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  organization_id?: Maybe<Scalars['String']['output']>;
  organization_name?: Maybe<Scalars['String']['output']>;
  platform_id?: Maybe<Scalars['String']['output']>;
  platform_name?: Maybe<Scalars['String']['output']>;
  schools?: Maybe<Array<Maybe<UserWithSchool_Schools>>>;
  type_id?: Maybe<Scalars['String']['output']>;
  type_name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type UserWithSchool_Groups = {
  __typename?: 'UserWithSchool_Groups';
  group_id?: Maybe<Scalars['String']['output']>;
  group_name?: Maybe<Scalars['String']['output']>;
};

export type UserWithSchool_Schools = {
  __typename?: 'UserWithSchool_Schools';
  region_id?: Maybe<Scalars['String']['output']>;
  region_name?: Maybe<Scalars['String']['output']>;
  school_id?: Maybe<Scalars['String']['output']>;
  school_name?: Maybe<Scalars['String']['output']>;
};

export type UsersSearch = {
  __typename?: 'UsersSearch';
  data?: Maybe<Array<Maybe<UserWithSchool>>>;
  total: Scalars['Int']['output'];
};

export type UsersTotal = {
  __typename?: 'UsersTotal';
  districts?: Maybe<Scalars['Float']['output']>;
  groups?: Maybe<Scalars['Float']['output']>;
  schools?: Maybe<Scalars['Float']['output']>;
  students?: Maybe<Scalars['Float']['output']>;
  teachers?: Maybe<Scalars['Float']['output']>;
};

export type UsersTotalDonations = {
  __typename?: 'UsersTotalDonations';
  total?: Maybe<Scalars['Float']['output']>;
  users?: Maybe<Scalars['Float']['output']>;
};

export type UsersTotalObj = {
  __typename?: 'UsersTotalObj';
  total: Scalars['Int']['output'];
  users?: Maybe<Array<Maybe<user>>>;
};

export type VaultDonationTotal = {
  __typename?: 'VaultDonationTotal';
  result?: Maybe<Scalars['Float']['output']>;
};

export type VaultDonations = {
  __typename?: 'VaultDonations';
  charityVaults?: Maybe<Array<Maybe<VaultDonations_CharityVaults>>>;
};

export type VaultDonations_CharityVaults = {
  __typename?: 'VaultDonations_CharityVaults';
  charity?: Maybe<VaultDonations_CharityVaults_Charity>;
  cover?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  goalDeedcoin?: Maybe<Scalars['Float']['output']>;
  goalUsd?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type VaultDonations_CharityVaults_Charity = {
  __typename?: 'VaultDonations_CharityVaults_Charity';
  category?: Maybe<VaultDonations_CharityVaults_Charity_Category>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type VaultDonations_CharityVaults_Charity_Category = {
  __typename?: 'VaultDonations_CharityVaults_Charity_Category';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
};

export type VaultUserDonations = {
  __typename?: 'VaultUserDonations';
  charityVaultDonations?: Maybe<Array<Maybe<VaultUserDonations_CharityVaultDonations>>>;
};

export type VaultUserDonations_CharityVaultDonations = {
  __typename?: 'VaultUserDonations_CharityVaultDonations';
  amount?: Maybe<Scalars['Float']['output']>;
  charityVault?: Maybe<VaultUserDonations_CharityVaultDonations_CharityVault>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  partnerOrganization?: Maybe<VaultUserDonations_CharityVaultDonations_PartnerOrganization>;
};

export type VaultUserDonations_CharityVaultDonations_CharityVault = {
  __typename?: 'VaultUserDonations_CharityVaultDonations_CharityVault';
  charity?: Maybe<VaultUserDonations_CharityVaultDonations_CharityVault_Charity>;
  createdAt?: Maybe<Scalars['String']['output']>;
  goalDeedcoin?: Maybe<Scalars['Float']['output']>;
  goalUsd?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type VaultUserDonations_CharityVaultDonations_CharityVault_Charity = {
  __typename?: 'VaultUserDonations_CharityVaultDonations_CharityVault_Charity';
  category?: Maybe<VaultUserDonations_CharityVaultDonations_CharityVault_Charity_Category>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  intro?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type VaultUserDonations_CharityVaultDonations_CharityVault_Charity_Category = {
  __typename?: 'VaultUserDonations_CharityVaultDonations_CharityVault_Charity_Category';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
};

export type VaultUserDonations_CharityVaultDonations_PartnerOrganization = {
  __typename?: 'VaultUserDonations_CharityVaultDonations_PartnerOrganization';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type animals = {
  __typename?: 'animals';
  _id: Scalars['String']['output'];
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  levels?: Maybe<Array<Maybe<animalsLevels>>>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type animalsLevels = {
  __typename?: 'animalsLevels';
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<animalsLevelsImage>;
  level?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
};

export type animalsLevelsImage = {
  __typename?: 'animalsLevelsImage';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type animalsLevelsImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type animalsLevelsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<animalsLevelsImageInput>;
  level?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
};

export type animalscategories = {
  __typename?: 'animalscategories';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type announcement = {
  __typename?: 'announcement';
  _id: Scalars['String']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type avatar = {
  __typename?: 'avatar';
  _id: Scalars['String']['output'];
  artwork?: Maybe<avatarArtwork>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type avatarArtwork = {
  __typename?: 'avatarArtwork';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type avatartypes = {
  __typename?: 'avatartypes';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type badgeMedia = {
  __typename?: 'badgeMedia';
  _id: Scalars['String']['output'];
  cover?: Maybe<badgeMediaCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<badgeMediaVideo>;
};

export type badgeMediaCover = {
  __typename?: 'badgeMediaCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type badgeMediaVideo = {
  __typename?: 'badgeMediaVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type badges = {
  __typename?: 'badges';
  _id?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<badgesCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<badgesVideo>;
};

export type badgesCover = {
  __typename?: 'badgesCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type badgesVideo = {
  __typename?: 'badgesVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type billingtypes = {
  __typename?: 'billingtypes';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  dateRenews?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  licenses?: Maybe<Scalars['Float']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type categories = {
  __typename?: 'categories';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type checkinquestion = {
  __typename?: 'checkinquestion';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['Boolean']['output']>;
  teacher?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type checkinuseranswer = {
  __typename?: 'checkinuseranswer';
  _id: Scalars['String']['output'];
  answer?: Maybe<Scalars['String']['output']>;
  checkinQuestion?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  questionObj?: Maybe<QuestionsObjTC>;
  scale?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type checkinuseranswerInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  answer?: InputMaybe<Scalars['String']['input']>;
  checkinQuestion?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  scale?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type classes = {
  __typename?: 'classes';
  _id?: Maybe<Scalars['String']['output']>;
  activity?: Maybe<Array<Maybe<classesActivity>>>;
  background?: Maybe<classesBackground>;
  bigIdea?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  classLength?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<classesCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discussion?: Maybe<Array<Maybe<classesDiscussion>>>;
  documents?: Maybe<Array<Maybe<classesDocuments>>>;
  extend?: Maybe<Array<Maybe<classesExtend>>>;
  extra?: Maybe<Scalars['Boolean']['output']>;
  extraActivities?: Maybe<Scalars['String']['output']>;
  extracurricular?: Maybe<classesExtracurricular>;
  feedback?: Maybe<Scalars['Boolean']['output']>;
  free?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<classesLanguage>;
  learningGoal?: Maybe<Scalars['String']['output']>;
  lifeSkill?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lifeSkillObj?: Maybe<Array<Maybe<lifeskill>>>;
  order?: Maybe<Scalars['Float']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  prefix?: Maybe<Scalars['String']['output']>;
  reflection?: Maybe<Array<Maybe<classesReflection>>>;
  skillSet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  skillSetObj?: Maybe<Array<Maybe<skillset>>>;
  skills?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  slug?: Maybe<Scalars['String']['output']>;
  students?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  subcategories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  theme?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  themeObj?: Maybe<Array<Maybe<theme>>>;
  title?: Maybe<Scalars['String']['output']>;
  trailer?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type classesActivity = {
  __typename?: 'classesActivity';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesBackground = {
  __typename?: 'classesBackground';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type classesBackgroundInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type classesCover = {
  __typename?: 'classesCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type classesCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type classesDiscussion = {
  __typename?: 'classesDiscussion';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesDiscussionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesDocuments = {
  __typename?: 'classesDocuments';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type classesDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type classesExtend = {
  __typename?: 'classesExtend';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesExtendInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesExtracurricular = {
  __typename?: 'classesExtracurricular';
  available?: Maybe<Scalars['Boolean']['output']>;
  points?: Maybe<Scalars['String']['output']>;
};

export type classesExtracurricularInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
};

export type classesLanguage = {
  __typename?: 'classesLanguage';
  _id?: Maybe<Scalars['MongoID']['output']>;
  english?: Maybe<classesLanguageEnglish>;
  french?: Maybe<classesLanguageFrench>;
  spanish?: Maybe<classesLanguageSpanish>;
};

export type classesLanguageEnglish = {
  __typename?: 'classesLanguageEnglish';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesLanguageFrench = {
  __typename?: 'classesLanguageFrench';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<classesLanguageEnglishInput>;
  french?: InputMaybe<classesLanguageFrenchInput>;
  spanish?: InputMaybe<classesLanguageSpanishInput>;
};

export type classesLanguageSpanish = {
  __typename?: 'classesLanguageSpanish';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classesReflection = {
  __typename?: 'classesReflection';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type classesReflectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type classificationtype = {
  __typename?: 'classificationtype';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type classlike = {
  __typename?: 'classlike';
  _id?: Maybe<Scalars['String']['output']>;
  class: Scalars['String']['output'];
  classObj?: Maybe<classes>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  teacher: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type collectible = {
  __typename?: 'collectible';
  _id: Scalars['String']['output'];
  artwork?: Maybe<collectibleArtwork>;
  cover?: Maybe<collectibleCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  curriculumObj?: Maybe<CurriculumObj>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  editions?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<collectibleVideo>;
};

export type collectibleArtwork = {
  __typename?: 'collectibleArtwork';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type collectibleArtworkInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type collectibleCover = {
  __typename?: 'collectibleCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type collectibleCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type collectibleInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  artwork?: InputMaybe<collectibleArtworkInput>;
  cover?: InputMaybe<collectibleCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  editions?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<collectibleVideoInput>;
};

export type collectibleVideo = {
  __typename?: 'collectibleVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type collectibleVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumcategory = {
  __typename?: 'curriculumcategory';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type curriculumcollection = {
  __typename?: 'curriculumcollection';
  _id: Scalars['String']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  gradeLevel?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type curriculumcollectionInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  gradeLevel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type curriculums = {
  __typename?: 'curriculums';
  _id: Scalars['String']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  animalCategory?: Maybe<Scalars['String']['output']>;
  bgImage?: Maybe<curriculumsBgImage>;
  category?: Maybe<Scalars['String']['output']>;
  classLength?: Maybe<Scalars['String']['output']>;
  courseDuration?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<curriculumsCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculumCollection?: Maybe<Array<Maybe<curriculumcollection>>>;
  description?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<Maybe<curriculumsDocuments>>>;
  donation?: Maybe<Scalars['Boolean']['output']>;
  grade?: Maybe<Scalars['String']['output']>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<curriculumsLanguage>;
  leaderBio?: Maybe<Scalars['String']['output']>;
  leaderName?: Maybe<Scalars['String']['output']>;
  learningGoal?: Maybe<Scalars['String']['output']>;
  lifeSkill?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lifeSkillObj?: Maybe<Array<Maybe<lifeskill>>>;
  logo?: Maybe<curriculumsLogo>;
  loop?: Maybe<curriculumsLoop>;
  mini?: Maybe<Scalars['Boolean']['output']>;
  mode?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  pacingGuide?: Maybe<curriculumsPacingGuide>;
  platform?: Maybe<Scalars['String']['output']>;
  resources?: Maybe<Array<Maybe<curriculumsResources>>>;
  schoolLevel?: Maybe<Scalars['String']['output']>;
  schoolLevelObj?: Maybe<SchoolLevelObjTC>;
  skillSet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  skillSetObj?: Maybe<Array<Maybe<skillset>>>;
  slug?: Maybe<Scalars['String']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  themeObj?: Maybe<Array<Maybe<theme>>>;
  title?: Maybe<Scalars['String']['output']>;
  totalClass?: Maybe<Scalars['Float']['output']>;
  totalLesson?: Maybe<Scalars['Float']['output']>;
  totalLessonRestricted?: Maybe<Scalars['Float']['output']>;
  trailer?: Maybe<curriculumsTrailer>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type curriculumsBgImage = {
  __typename?: 'curriculumsBgImage';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsBgImageInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsCover = {
  __typename?: 'curriculumsCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsDocuments = {
  __typename?: 'curriculumsDocuments';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsDocumentsInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  animalCategory?: InputMaybe<Scalars['String']['input']>;
  bgImage?: InputMaybe<curriculumsBgImageInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  classLength?: InputMaybe<Scalars['String']['input']>;
  courseDuration?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<curriculumsCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculumCollection?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  documents?: InputMaybe<Array<InputMaybe<curriculumsDocumentsInput>>>;
  donation?: InputMaybe<Scalars['Boolean']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<curriculumsLanguageInput>;
  leaderBio?: InputMaybe<Scalars['String']['input']>;
  leaderName?: InputMaybe<Scalars['String']['input']>;
  learningGoal?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logo?: InputMaybe<curriculumsLogoInput>;
  loop?: InputMaybe<curriculumsLoopInput>;
  mini?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  pacingGuide?: InputMaybe<curriculumsPacingGuideInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  resources?: InputMaybe<Array<InputMaybe<curriculumsResourcesInput>>>;
  schoolLevel?: InputMaybe<Scalars['String']['input']>;
  skillSet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  teacher?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  totalClass?: InputMaybe<Scalars['Float']['input']>;
  totalLesson?: InputMaybe<Scalars['Float']['input']>;
  totalLessonRestricted?: InputMaybe<Scalars['Float']['input']>;
  trailer?: InputMaybe<curriculumsTrailerInput>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type curriculumsLanguage = {
  __typename?: 'curriculumsLanguage';
  _id?: Maybe<Scalars['MongoID']['output']>;
  english?: Maybe<curriculumsLanguageEnglish>;
  french?: Maybe<curriculumsLanguageFrench>;
  spanish?: Maybe<curriculumsLanguageSpanish>;
};

export type curriculumsLanguageEnglish = {
  __typename?: 'curriculumsLanguageEnglish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsLanguageFrench = {
  __typename?: 'curriculumsLanguageFrench';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<curriculumsLanguageEnglishInput>;
  french?: InputMaybe<curriculumsLanguageFrenchInput>;
  spanish?: InputMaybe<curriculumsLanguageSpanishInput>;
};

export type curriculumsLanguageSpanish = {
  __typename?: 'curriculumsLanguageSpanish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsLogo = {
  __typename?: 'curriculumsLogo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsLoop = {
  __typename?: 'curriculumsLoop';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsLoopInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsPacingGuide = {
  __typename?: 'curriculumsPacingGuide';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPacingGuideInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsPayment = {
  __typename?: 'curriculumsPayment';
  _id: Scalars['String']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  animalCategory?: Maybe<Scalars['String']['output']>;
  bgImage?: Maybe<curriculumsPaymentBgImage>;
  category?: Maybe<Scalars['String']['output']>;
  classLength?: Maybe<Scalars['String']['output']>;
  courseDuration?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<curriculumsPaymentCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculumCollection?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  description?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<Maybe<curriculumsPaymentDocuments>>>;
  donation?: Maybe<Scalars['Boolean']['output']>;
  grade?: Maybe<Scalars['String']['output']>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<curriculumsPaymentLanguage>;
  leaderBio?: Maybe<Scalars['String']['output']>;
  leaderName?: Maybe<Scalars['String']['output']>;
  learningGoal?: Maybe<Scalars['String']['output']>;
  lifeSkill?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  logo?: Maybe<curriculumsPaymentLogo>;
  loop?: Maybe<curriculumsPaymentLoop>;
  mini?: Maybe<Scalars['Boolean']['output']>;
  mode?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  pacingGuide?: Maybe<curriculumsPaymentPacingGuide>;
  platform?: Maybe<Scalars['String']['output']>;
  resources?: Maybe<Array<Maybe<curriculumsPaymentResources>>>;
  schoolLevel?: Maybe<Scalars['String']['output']>;
  skillSet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  slug?: Maybe<Scalars['String']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  totalClass?: Maybe<Scalars['Float']['output']>;
  totalLesson?: Maybe<Scalars['Float']['output']>;
  totalLessonRestricted?: Maybe<Scalars['Float']['output']>;
  trailer?: Maybe<curriculumsPaymentTrailer>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type curriculumsPaymentBgImage = {
  __typename?: 'curriculumsPaymentBgImage';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentCover = {
  __typename?: 'curriculumsPaymentCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentDocuments = {
  __typename?: 'curriculumsPaymentDocuments';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentLanguage = {
  __typename?: 'curriculumsPaymentLanguage';
  _id?: Maybe<Scalars['MongoID']['output']>;
  english?: Maybe<curriculumsPaymentLanguageEnglish>;
  french?: Maybe<curriculumsPaymentLanguageFrench>;
  spanish?: Maybe<curriculumsPaymentLanguageSpanish>;
};

export type curriculumsPaymentLanguageEnglish = {
  __typename?: 'curriculumsPaymentLanguageEnglish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentLanguageFrench = {
  __typename?: 'curriculumsPaymentLanguageFrench';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentLanguageSpanish = {
  __typename?: 'curriculumsPaymentLanguageSpanish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentLogo = {
  __typename?: 'curriculumsPaymentLogo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentLoop = {
  __typename?: 'curriculumsPaymentLoop';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentPacingGuide = {
  __typename?: 'curriculumsPaymentPacingGuide';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentResources = {
  __typename?: 'curriculumsPaymentResources';
  _id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentTrailer = {
  __typename?: 'curriculumsPaymentTrailer';
  captions?: Maybe<Array<Maybe<curriculumsPaymentTrailerCaptions>>>;
  skip?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentTrailerCaptions = {
  __typename?: 'curriculumsPaymentTrailerCaptions';
  available?: Maybe<Scalars['Boolean']['output']>;
  file?: Maybe<curriculumsPaymentTrailerCaptionsFile>;
  language?: Maybe<Scalars['String']['output']>;
};

export type curriculumsPaymentTrailerCaptionsFile = {
  __typename?: 'curriculumsPaymentTrailerCaptionsFile';
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsResources = {
  __typename?: 'curriculumsResources';
  _id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsResourcesInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export enum curriculumsSortEnum {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC'
}

export type curriculumsTrailer = {
  __typename?: 'curriculumsTrailer';
  captions?: Maybe<Array<Maybe<curriculumsTrailerCaptions>>>;
  skip?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsTrailerCaptions = {
  __typename?: 'curriculumsTrailerCaptions';
  available?: Maybe<Scalars['Boolean']['output']>;
  file?: Maybe<curriculumsTrailerCaptionsFile>;
  language?: Maybe<Scalars['String']['output']>;
};

export type curriculumsTrailerCaptionsFile = {
  __typename?: 'curriculumsTrailerCaptionsFile';
  url?: Maybe<Scalars['String']['output']>;
};

export type curriculumsTrailerCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsTrailerCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<curriculumsTrailerCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type curriculumsTrailerInput = {
  captions?: InputMaybe<Array<InputMaybe<curriculumsTrailerCaptionsInput>>>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type district = {
  __typename?: 'district';
  _id: Scalars['String']['output'];
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  courses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  coursesCollections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  coverPhoto?: Maybe<districtCoverPhoto>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  exemptionDates?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
  extraCourse?: Maybe<Scalars['Boolean']['output']>;
  licenseExpDate?: Maybe<Scalars['Date']['output']>;
  licenseLabel?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<districtLogo>;
  name?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  schoolLicense?: Maybe<Scalars['Boolean']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userTotal?: Maybe<Scalars['Float']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type districtCoverPhoto = {
  __typename?: 'districtCoverPhoto';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type districtCoverPhotoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type districtLogo = {
  __typename?: 'districtLogo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type districtLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type districtprofile = {
  __typename?: 'districtprofile';
  _id: Scalars['String']['output'];
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<districtprofileCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<districtprofileLogo>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type districtprofileCover = {
  __typename?: 'districtprofileCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type districtprofileCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type districtprofileInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<districtprofileCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<districtprofileLogoInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type districtprofileLogo = {
  __typename?: 'districtprofileLogo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type districtprofileLogoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type favorites = {
  __typename?: 'favorites';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  curriculumObj?: Maybe<curriculums>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type favoritesInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type feedback = {
  __typename?: 'feedback';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type grade = {
  __typename?: 'grade';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type groupprogress = {
  __typename?: 'groupprogress';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  classObj?: Maybe<classes>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  finishedClasses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  finishedLesson?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  group?: Maybe<Scalars['String']['output']>;
  groupObj?: Maybe<groupprogress>;
  lesson?: Maybe<Scalars['String']['output']>;
  lessonObj?: Maybe<classes>;
  nextClass?: Maybe<Scalars['String']['output']>;
  nextClassObj?: Maybe<classes>;
  nextLesson?: Maybe<Scalars['String']['output']>;
  nextLessonObj?: Maybe<classes>;
  platform?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type groupprogressInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  finishedClasses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  finishedLesson?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  group?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  nextClass?: InputMaybe<Scalars['String']['input']>;
  nextLesson?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  progress?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type groups = {
  __typename?: 'groups';
  _id: Scalars['String']['output'];
  classLink?: Maybe<Scalars['Boolean']['output']>;
  classes?: Maybe<Array<Maybe<groupsClasses>>>;
  cleverId?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<groupsCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculums?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  curriculumsObj?: Maybe<Array<Maybe<curriculumsPayment>>>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  grade?: Maybe<Scalars['String']['output']>;
  leaderName?: Maybe<Scalars['String']['output']>;
  manager?: Maybe<Scalars['String']['output']>;
  managerObj?: Maybe<userPayment>;
  name?: Maybe<Scalars['String']['output']>;
  oneRosterId?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type groupsClasses = {
  __typename?: 'groupsClasses';
  id?: Maybe<Scalars['String']['output']>;
  unLock?: Maybe<Scalars['Boolean']['output']>;
};

export type groupsClassesInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  unLock?: InputMaybe<Scalars['Boolean']['input']>;
};

export type groupsCover = {
  __typename?: 'groupsCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type groupsCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type groupsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  classLink?: InputMaybe<Scalars['Boolean']['input']>;
  classes?: InputMaybe<Array<InputMaybe<groupsClassesInput>>>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<groupsCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  leaderName?: InputMaybe<Scalars['String']['input']>;
  manager?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type impact = {
  __typename?: 'impact';
  _id: Scalars['String']['output'];
  cover?: Maybe<impactCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  userType?: Maybe<Scalars['String']['output']>;
};

export type impactCover = {
  __typename?: 'impactCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type impactCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type journals = {
  __typename?: 'journals';
  _id: Scalars['String']['output'];
  analyze?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  documents?: Maybe<Array<Maybe<journalsDocuments>>>;
  group?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  scale?: Maybe<Scalars['Float']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  userObj?: Maybe<UserMedia>;
};

export type journalsDocuments = {
  __typename?: 'journalsDocuments';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type languageObjTC = {
  __typename?: 'languageObjTC';
  description: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  label: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type languageTC = {
  __typename?: 'languageTC';
  english?: Maybe<languageObjTC>;
  french?: Maybe<languageObjTC>;
  spanish?: Maybe<languageObjTC>;
};

export type lesson = {
  __typename?: 'lesson';
  _id?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  classificationType?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  cover?: Maybe<lessonCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lifeSkill?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lifeSkillObj?: Maybe<Array<Maybe<lifeskill>>>;
  order?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type lessonCover = {
  __typename?: 'lessonCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type lessonCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type lessonInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  classificationType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cover?: InputMaybe<lessonCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  lifeSkill?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export enum lessonSortEnumTC {
  CLASS_ASC = 'CLASS_ASC',
  CLASS_DESC = 'CLASS_DESC',
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC',
  ORDER_ASC = 'ORDER_ASC',
  ORDER_DESC = 'ORDER_DESC',
  _ID_ASC = '_ID_ASC',
  _ID_DESC = '_ID_DESC'
}

export type licensepreset = {
  __typename?: 'licensepreset';
  _id: Scalars['String']['output'];
  courses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  coursesCollection?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type lifeskill = {
  __typename?: 'lifeskill';
  _id?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<lifeskillIcon>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type lifeskillIcon = {
  __typename?: 'lifeskillIcon';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type lifeskillIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type mood = {
  __typename?: 'mood';
  _id: Scalars['String']['output'];
  category?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<moodCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  textColor?: Maybe<Scalars['String']['output']>;
  tips?: Maybe<Array<Maybe<moodTips>>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<moodVideo>;
};

export type moodCover = {
  __typename?: 'moodCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type moodCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type moodInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<moodCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  textColor?: InputMaybe<Scalars['String']['input']>;
  tips?: InputMaybe<Array<InputMaybe<moodTipsInput>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  video?: InputMaybe<moodVideoInput>;
};

export type moodTips = {
  __typename?: 'moodTips';
  description?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type moodTipsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type moodVideo = {
  __typename?: 'moodVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type moodVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type moodcategory = {
  __typename?: 'moodcategory';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type narrators = {
  __typename?: 'narrators';
  _id: Scalars['String']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<narratorsAvatar>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type narratorsAvatar = {
  __typename?: 'narratorsAvatar';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type narratorsAvatarInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type organization = {
  __typename?: 'organization';
  _id: Scalars['String']['output'];
  code?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<organizationCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  extraCourse?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['Date']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type organizationCover = {
  __typename?: 'organizationCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type organizationtoken = {
  __typename?: 'organizationtoken';
  _id: Scalars['String']['output'];
  cleverDistrictId?: Maybe<Scalars['String']['output']>;
  cleverToken?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  oneRosterAppId?: Maybe<Scalars['String']['output']>;
  oneRosterToken?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type parentchildren = {
  __typename?: 'parentchildren';
  _id: Scalars['String']['output'];
  approved?: Maybe<Scalars['Boolean']['output']>;
  approvedAt?: Maybe<Scalars['Date']['output']>;
  child: Scalars['String']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  parent: Scalars['String']['output'];
  slot: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type pin = {
  __typename?: 'pin';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<pinCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  sparkLibrary?: Maybe<Scalars['String']['output']>;
  times?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<pinVideo>;
};

export type pinCover = {
  __typename?: 'pinCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type pinCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type pinVideo = {
  __typename?: 'pinVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type pinVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type pintemplate = {
  __typename?: 'pintemplate';
  _id: Scalars['String']['output'];
  cover?: Maybe<pintemplateCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<pintemplateVideo>;
};

export type pintemplateCover = {
  __typename?: 'pintemplateCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type pintemplateCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type pintemplateVideo = {
  __typename?: 'pintemplateVideo';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type pintemplateVideoInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type progress = {
  __typename?: 'progress';
  _id: Scalars['String']['output'];
  answerResponse?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  ended?: Maybe<Scalars['Boolean']['output']>;
  extraAnswerResponse?: Maybe<Scalars['Float']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  taps?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  time?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type questionnaires = {
  __typename?: 'questionnaires';
  _id: Scalars['String']['output'];
  answer?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  approved?: Maybe<Scalars['Boolean']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type questions = {
  __typename?: 'questions';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  labelHtml?: Maybe<Scalars['String']['output']>;
  language?: Maybe<questionsLanguage>;
  platform?: Maybe<Scalars['String']['output']>;
  responses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  responsesObj?: Maybe<Array<Maybe<responses>>>;
  rightAnswers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  rightAnswersObj?: Maybe<responses>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type questionsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  labelHtml?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<questionsLanguageInput>;
  platform?: InputMaybe<Scalars['String']['input']>;
  responses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  rightAnswers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type questionsLanguage = {
  __typename?: 'questionsLanguage';
  _id?: Maybe<Scalars['MongoID']['output']>;
  english?: Maybe<questionsLanguageEnglish>;
  french?: Maybe<questionsLanguageFrench>;
  spanish?: Maybe<questionsLanguageSpanish>;
};

export type questionsLanguageEnglish = {
  __typename?: 'questionsLanguageEnglish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type questionsLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type questionsLanguageFrench = {
  __typename?: 'questionsLanguageFrench';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type questionsLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type questionsLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<questionsLanguageEnglishInput>;
  french?: InputMaybe<questionsLanguageFrenchInput>;
  spanish?: InputMaybe<questionsLanguageSpanishInput>;
};

export type questionsLanguageSpanish = {
  __typename?: 'questionsLanguageSpanish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type questionsLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum questionsSortEnum {
  CREATEDAT_ASC = 'CREATEDAT_ASC',
  CREATEDAT_DESC = 'CREATEDAT_DESC'
}

export type region = {
  __typename?: 'region';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  exemptionDates?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type reports = {
  __typename?: 'reports';
  _id: Scalars['String']['output'];
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  scale?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type resource = {
  __typename?: 'resource';
  _id: Scalars['String']['output'];
  category?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  classObj?: Maybe<classes>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  file?: Maybe<resourceFile>;
  lesson?: Maybe<Scalars['String']['output']>;
  lessonObj?: Maybe<lesson>;
  link?: Maybe<Scalars['String']['output']>;
  metaKey?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  platform?: Maybe<Scalars['String']['output']>;
  tap?: Maybe<Scalars['String']['output']>;
  tapObj?: Maybe<tap>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type resourceFile = {
  __typename?: 'resourceFile';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type resourceFileInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type resourceInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<resourceFileInput>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  metaKey?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  platform?: InputMaybe<Scalars['String']['input']>;
  tap?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type resourcecategory = {
  __typename?: 'resourcecategory';
  _id: Scalars['String']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<resourcecategoryIcon>;
  platform?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type resourcecategoryIcon = {
  __typename?: 'resourcecategoryIcon';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type resourcecategoryIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type responses = {
  __typename?: 'responses';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  language?: Maybe<responsesLanguage>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type responsesLanguage = {
  __typename?: 'responsesLanguage';
  _id?: Maybe<Scalars['MongoID']['output']>;
  english?: Maybe<responsesLanguageEnglish>;
  french?: Maybe<responsesLanguageFrench>;
  spanish?: Maybe<responsesLanguageSpanish>;
};

export type responsesLanguageEnglish = {
  __typename?: 'responsesLanguageEnglish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type responsesLanguageEnglishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type responsesLanguageFrench = {
  __typename?: 'responsesLanguageFrench';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type responsesLanguageFrenchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type responsesLanguageInput = {
  _id?: InputMaybe<Scalars['MongoID']['input']>;
  english?: InputMaybe<responsesLanguageEnglishInput>;
  french?: InputMaybe<responsesLanguageFrenchInput>;
  spanish?: InputMaybe<responsesLanguageSpanishInput>;
};

export type responsesLanguageSpanish = {
  __typename?: 'responsesLanguageSpanish';
  description?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type responsesLanguageSpanishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type schoolcode = {
  __typename?: 'schoolcode';
  _id?: Maybe<Scalars['String']['output']>;
  classes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculums?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  expirationDate?: Maybe<Scalars['Date']['output']>;
  limit?: Maybe<Scalars['Float']['output']>;
  mini?: Maybe<Scalars['Boolean']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type schoollevel = {
  __typename?: 'schoollevel';
  _id: Scalars['String']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  survey?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type schoolsData = {
  __typename?: 'schoolsData';
  _id: Scalars['String']['output'];
  city?: Maybe<Scalars['String']['output']>;
  cleverId?: Maybe<Scalars['String']['output']>;
  cleverSync?: Maybe<Scalars['Boolean']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  courses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  coursesCollections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  extraCourse?: Maybe<Scalars['Boolean']['output']>;
  licenseExpDate?: Maybe<Scalars['Date']['output']>;
  licenseLabel?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  oneRosterId?: Maybe<Scalars['String']['output']>;
  partnerCenterId?: Maybe<Scalars['String']['output']>;
  partnerProvider?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['String']['output']>;
  settingsObj?: Maybe<schoolsettings>;
  slug?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type schoolsDataInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  cleverSync?: InputMaybe<Scalars['Boolean']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  courses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coursesCollections?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  extraCourse?: InputMaybe<Scalars['Boolean']['input']>;
  licenseExpDate?: InputMaybe<Scalars['Date']['input']>;
  licenseLabel?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  partnerCenterId?: InputMaybe<Scalars['String']['input']>;
  partnerProvider?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type schoolsettings = {
  __typename?: 'schoolsettings';
  _id: Scalars['String']['output'];
  accessWithClassLink?: Maybe<Scalars['Boolean']['output']>;
  accessWithClever?: Maybe<Scalars['Boolean']['output']>;
  accessWithEmail?: Maybe<Scalars['Boolean']['output']>;
  accessWithGoogle?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  restrictions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  school?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type schoolusers = {
  __typename?: 'schoolusers';
  _id: Scalars['String']['output'];
  classLink?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  pending?: Maybe<Scalars['Boolean']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  schoolObj?: Maybe<schoolsData>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type schoolusersInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  classLink?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type skillset = {
  __typename?: 'skillset';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<skillsetIcon>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type skillsetIcon = {
  __typename?: 'skillsetIcon';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type skillsetIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibrary = {
  __typename?: 'sparklibrary';
  _id: Scalars['String']['output'];
  article?: Maybe<sparklibraryArticle>;
  articleBody?: Maybe<Scalars['String']['output']>;
  articleQuestion?: Maybe<Array<Maybe<sparklibraryArticleQuestion>>>;
  articleTitle?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<sparklibraryCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  funFact?: Maybe<Array<Maybe<sparklibraryFunFact>>>;
  journals?: Maybe<Array<Maybe<sparklibraryJournals>>>;
  lesson?: Maybe<Scalars['String']['output']>;
  mindfulMoment?: Maybe<Array<Maybe<sparklibraryMindfulMoment>>>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  takeAwayDescription?: Maybe<Scalars['String']['output']>;
  takeAwayLabel?: Maybe<Scalars['String']['output']>;
  times?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<sparklibraryVideo>;
  videoQuestions?: Maybe<Array<Maybe<sparklibraryVideoQuestions>>>;
};

export type sparklibraryArticle = {
  __typename?: 'sparklibraryArticle';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryArticleInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryArticleQuestion = {
  __typename?: 'sparklibraryArticleQuestion';
  points?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryArticleQuestionInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryCover = {
  __typename?: 'sparklibraryCover';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryCoverInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryFunFact = {
  __typename?: 'sparklibraryFunFact';
  points?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryFunFactInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryJournals = {
  __typename?: 'sparklibraryJournals';
  points?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryJournalsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryMindfulMoment = {
  __typename?: 'sparklibraryMindfulMoment';
  points?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryMindfulMomentInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryVideo = {
  __typename?: 'sparklibraryVideo';
  captions?: Maybe<Array<Maybe<sparklibraryVideoCaptions>>>;
  thumbnail?: Maybe<sparklibraryVideoThumbnail>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryVideoCaptions = {
  __typename?: 'sparklibraryVideoCaptions';
  available?: Maybe<Scalars['Boolean']['output']>;
  file?: Maybe<sparklibraryVideoCaptionsFile>;
  language?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryVideoCaptionsFile = {
  __typename?: 'sparklibraryVideoCaptionsFile';
  url?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryVideoCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryVideoCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<sparklibraryVideoCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryVideoInput = {
  captions?: InputMaybe<Array<InputMaybe<sparklibraryVideoCaptionsInput>>>;
  thumbnail?: InputMaybe<sparklibraryVideoThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryVideoQuestions = {
  __typename?: 'sparklibraryVideoQuestions';
  points?: Maybe<Scalars['String']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryVideoQuestionsInput = {
  points?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryVideoThumbnail = {
  __typename?: 'sparklibraryVideoThumbnail';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type sparklibraryVideoThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type sparklibraryuser = {
  __typename?: 'sparklibraryuser';
  _id: Scalars['String']['output'];
  articleResponses?: Maybe<Array<Maybe<sparklibraryuserArticleResponses>>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  finished?: Maybe<Scalars['Boolean']['output']>;
  found?: Maybe<Scalars['Boolean']['output']>;
  funFact?: Maybe<Array<Maybe<sparklibraryuserFunFact>>>;
  journals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  mindfulMoment?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  platform?: Maybe<Scalars['String']['output']>;
  sparkLibrary?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  videoResponses?: Maybe<Array<Maybe<sparklibraryuserVideoResponses>>>;
};

export type sparklibraryuserArticleResponses = {
  __typename?: 'sparklibraryuserArticleResponses';
  _id?: Maybe<Scalars['String']['output']>;
  assert?: Maybe<Scalars['Boolean']['output']>;
};

export type sparklibraryuserFunFact = {
  __typename?: 'sparklibraryuserFunFact';
  _id?: Maybe<Scalars['String']['output']>;
  assert?: Maybe<Scalars['Boolean']['output']>;
};

export type sparklibraryuserVideoResponses = {
  __typename?: 'sparklibraryuserVideoResponses';
  _id?: Maybe<Scalars['String']['output']>;
  assert?: Maybe<Scalars['Boolean']['output']>;
};

export type sticker = {
  __typename?: 'sticker';
  _id: Scalars['String']['output'];
  cover?: Maybe<stickerCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deedlyVault?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  video?: Maybe<stickerVideo>;
};

export type stickerCover = {
  __typename?: 'stickerCover';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type stickerCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type stickerVideo = {
  __typename?: 'stickerVideo';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type stickerVideoInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type subcategories = {
  __typename?: 'subcategories';
  _id: Scalars['String']['output'];
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type subscription = {
  __typename?: 'subscription';
  _id: Scalars['String']['output'];
  appleLatestReceipt?: Maybe<Scalars['String']['output']>;
  autoRenew?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  expirationDate?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  promoCodes?: Maybe<Scalars['String']['output']>;
  stripeId?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
  types?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  usersLeft?: Maybe<Scalars['Float']['output']>;
};

export type tap = {
  __typename?: 'tap';
  _id?: Maybe<Scalars['String']['output']>;
  additional?: Maybe<Scalars['String']['output']>;
  canva?: Maybe<Array<Maybe<tapCanva>>>;
  class?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<tapCover>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  donation?: Maybe<Scalars['Float']['output']>;
  donationVault?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  extraQuestions?: Maybe<Array<Maybe<tapExtraQuestions>>>;
  intro?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Scalars['String']['output']>;
  lifeSkills?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  order?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
  questions?: Maybe<Array<Maybe<tapQuestions>>>;
  resources?: Maybe<Array<Maybe<tapResources>>>;
  resourcesObj?: Maybe<Array<Maybe<resource>>>;
  slug?: Maybe<Scalars['String']['output']>;
  sparkLibrary?: Maybe<Scalars['String']['output']>;
  survey?: Maybe<Scalars['String']['output']>;
  themes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  time?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  videos?: Maybe<Array<Maybe<tapVideos>>>;
};

export type tapCanva = {
  __typename?: 'tapCanva';
  ratio?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type tapCanvaInput = {
  ratio?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type tapCover = {
  __typename?: 'tapCover';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type tapCoverInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type tapExtraQuestions = {
  __typename?: 'tapExtraQuestions';
  points?: Maybe<Scalars['Float']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type tapExtraQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type tapInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  additional?: InputMaybe<Scalars['String']['input']>;
  canva?: InputMaybe<Array<InputMaybe<tapCanvaInput>>>;
  class?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<tapCoverInput>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  donation?: InputMaybe<Scalars['Float']['input']>;
  donationVault?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  extraQuestions?: InputMaybe<Array<InputMaybe<tapExtraQuestionsInput>>>;
  intro?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lesson?: InputMaybe<Scalars['String']['input']>;
  lifeSkills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
  questions?: InputMaybe<Array<InputMaybe<tapQuestionsInput>>>;
  resources?: InputMaybe<Array<InputMaybe<tapResourcesInput>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  survey?: InputMaybe<Scalars['String']['input']>;
  themes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  time?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  videos?: InputMaybe<Array<InputMaybe<tapVideosInput>>>;
};

export type tapQuestions = {
  __typename?: 'tapQuestions';
  points?: Maybe<Scalars['Float']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type tapQuestionsInput = {
  points?: InputMaybe<Scalars['Float']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type tapResources = {
  __typename?: 'tapResources';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type tapResourcesInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type tapVideos = {
  __typename?: 'tapVideos';
  _id?: Maybe<Scalars['String']['output']>;
  captions?: Maybe<Array<Maybe<tapVideosCaptions>>>;
  narrator?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  skip?: Maybe<Scalars['Float']['output']>;
  thumbnail?: Maybe<tapVideosThumbnail>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type tapVideosCaptions = {
  __typename?: 'tapVideosCaptions';
  available?: Maybe<Scalars['Boolean']['output']>;
  file?: Maybe<tapVideosCaptionsFile>;
  language?: Maybe<Scalars['String']['output']>;
};

export type tapVideosCaptionsFile = {
  __typename?: 'tapVideosCaptionsFile';
  url?: Maybe<Scalars['String']['output']>;
};

export type tapVideosCaptionsFileInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

export type tapVideosCaptionsInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  file?: InputMaybe<tapVideosCaptionsFileInput>;
  language?: InputMaybe<Scalars['String']['input']>;
};

export type tapVideosInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  captions?: InputMaybe<Array<InputMaybe<tapVideosCaptionsInput>>>;
  narrator?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<tapVideosThumbnailInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type tapVideosThumbnail = {
  __typename?: 'tapVideosThumbnail';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type tapVideosThumbnailInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type taptype = {
  __typename?: 'taptype';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type theme = {
  __typename?: 'theme';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<themeIcon>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type themeIcon = {
  __typename?: 'themeIcon';
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type themeIconInput = {
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type user = {
  __typename?: 'user';
  _id: Scalars['String']['output'];
  acceptTerms?: Maybe<Scalars['Boolean']['output']>;
  acceptTermsDate?: Maybe<Scalars['Date']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['Date']['output']>;
  classLinkId?: Maybe<Scalars['String']['output']>;
  classLinkSync?: Maybe<Scalars['Boolean']['output']>;
  cleverId?: Maybe<Scalars['String']['output']>;
  cleverSync?: Maybe<Scalars['Boolean']['output']>;
  cleverToken?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deedlyAuthenticationToken?: Maybe<Scalars['String']['output']>;
  deedlyUserId?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['Date']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mfaCode?: Maybe<Scalars['String']['output']>;
  mfaCodeExpiry?: Maybe<Scalars['Date']['output']>;
  oneRosterId?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  partnerId?: Maybe<Scalars['String']['output']>;
  partnerProvider?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
  profilePicture?: Maybe<userProfilePicture>;
  schoolCode?: Maybe<Scalars['String']['output']>;
  schoolCodeObj?: Maybe<schoolcode>;
  tag?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  typeObj?: Maybe<usertypes>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type userInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birthday?: InputMaybe<Scalars['Date']['input']>;
  classLinkId?: InputMaybe<Scalars['String']['input']>;
  classLinkSync?: InputMaybe<Scalars['Boolean']['input']>;
  cleverId?: InputMaybe<Scalars['String']['input']>;
  cleverSync?: InputMaybe<Scalars['Boolean']['input']>;
  cleverToken?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyAuthenticationToken?: InputMaybe<Scalars['String']['input']>;
  deedlyUserId?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lastLogin?: InputMaybe<Scalars['Date']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  mfaCode?: InputMaybe<Scalars['String']['input']>;
  mfaCodeExpiry?: InputMaybe<Scalars['Date']['input']>;
  oneRosterId?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  partnerId?: InputMaybe<Scalars['String']['input']>;
  partnerProvider?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<userProfilePictureInput>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type userPayment = {
  __typename?: 'userPayment';
  _id?: Maybe<Scalars['String']['output']>;
  acceptTerms?: Maybe<Scalars['Boolean']['output']>;
  acceptTermsDate?: Maybe<Scalars['Date']['output']>;
  appleId?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['Date']['output']>;
  classLinkId?: Maybe<Scalars['String']['output']>;
  classLinkSync?: Maybe<Scalars['Boolean']['output']>;
  cleverId?: Maybe<Scalars['String']['output']>;
  cleverSync?: Maybe<Scalars['Boolean']['output']>;
  cleverToken?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deedlyAuthenticationToken?: Maybe<Scalars['String']['output']>;
  deedlyUserId?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['Date']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mfaCode?: Maybe<Scalars['String']['output']>;
  mfaCodeExpiry?: Maybe<Scalars['Date']['output']>;
  oneRosterId?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  partnerId?: Maybe<Scalars['String']['output']>;
  partnerProvider?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Float']['output']>;
  profilePicture?: Maybe<userPaymentProfilePicture>;
  resetPasswordToken?: Maybe<Scalars['String']['output']>;
  schoolCode?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['String']['output']>;
  stripeId?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type userPaymentProfilePicture = {
  __typename?: 'userPaymentProfilePicture';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type userProfilePicture = {
  __typename?: 'userProfilePicture';
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type userProfilePictureInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type useranimals = {
  __typename?: 'useranimals';
  _id: Scalars['String']['output'];
  animal?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type userbadge = {
  __typename?: 'userbadge';
  _id: Scalars['String']['output'];
  badge?: Maybe<Scalars['String']['output']>;
  badgeObj?: Maybe<badges>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  curriculum?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type userbadgeInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  badge?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  curriculum?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type usercollectibles = {
  __typename?: 'usercollectibles';
  _id: Scalars['String']['output'];
  collectible?: Maybe<Scalars['String']['output']>;
  collectibleObj?: Maybe<collectible>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type usergroups = {
  __typename?: 'usergroups';
  _id: Scalars['String']['output'];
  classLink?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  groupObj?: Maybe<groups>;
  manager?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  userObj?: Maybe<userPayment>;
};

export type usergroupsInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  classLink?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  manager?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type usermood = {
  __typename?: 'usermood';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  moodObj?: Maybe<mood>;
  moods?: Maybe<Array<Maybe<usermoodMoods>>>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type usermoodMoods = {
  __typename?: 'usermoodMoods';
  id?: Maybe<Scalars['String']['output']>;
  intensity?: Maybe<Scalars['Float']['output']>;
};

export type userorganization = {
  __typename?: 'userorganization';
  _id: Scalars['String']['output'];
  accepted?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  expiredIn?: Maybe<Scalars['Date']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
  usertype?: Maybe<Scalars['String']['output']>;
};

export type userpin = {
  __typename?: 'userpin';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  pin?: Maybe<Scalars['String']['output']>;
  pinObj?: Maybe<pin>;
  platform?: Maybe<Scalars['String']['output']>;
  sparkLibrary?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type userpinInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  pin?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sparkLibrary?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type usersticker = {
  __typename?: 'usersticker';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  deedlyVault?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  sticker?: Maybe<Scalars['String']['output']>;
  stickerObj?: Maybe<sticker>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type userstickerInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Date']['input']>;
  deedlyVault?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['Date']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sticker?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Date']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type usertypes = {
  __typename?: 'usertypes';
  _id: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type videosparks = {
  __typename?: 'videosparks';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  sparks?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type videotap = {
  __typename?: 'videotap';
  _id: Scalars['String']['output'];
  class?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  end?: Maybe<Scalars['Float']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  sparkLibrary?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['Float']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename: 'Query' };

export type AnnouncementCreateOneMutationVariables = Exact<{
  record: CreateOneannouncementInput;
}>;


export type AnnouncementCreateOneMutation = { __typename?: 'Mutation', AnnouncementCreateOne?: { __typename?: 'CreateOneannouncementPayload', recordId?: string | null, record?: { __typename?: 'announcement', _id: string, message?: string | null, type?: string | null, active?: boolean | null, createdAt?: any | null } | null, error?: never | null } | null };

export type AnnouncementUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdannouncementInput;
}>;


export type AnnouncementUpdateOneMutation = { __typename?: 'Mutation', AnnouncementUpdateOne?: { __typename?: 'UpdateByIdannouncementPayload', recordId?: string | null, record?: { __typename?: 'announcement', _id: string, message?: string | null, type?: string | null, active?: boolean | null, createdAt?: any | null } | null, error?: never | null } | null };

export type AnnouncementDeleteOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type AnnouncementDeleteOneMutation = { __typename?: 'Mutation', AnnouncementDeleteOne: string };

export type ClassLikeCreateOneMutationVariables = Exact<{
  class: Scalars['String']['input'];
}>;


export type ClassLikeCreateOneMutation = { __typename?: 'Mutation', ClassLikeCreateOne?: { __typename?: 'classes', _id?: string | null } | null };

export type ClassLikeDeleteOneMutationVariables = Exact<{
  class: Scalars['String']['input'];
}>;


export type ClassLikeDeleteOneMutation = { __typename?: 'Mutation', ClassLikeDeleteOne?: string | null };

export type ClassesCreateOneMutationVariables = Exact<{
  record: CreateOneclassesInput;
}>;


export type ClassesCreateOneMutation = { __typename?: 'Mutation', ClassesCreateOne?: { __typename?: 'CreateOneclassesPayload', recordId?: string | null, record?: { __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type ClassesUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdclassesInput;
}>;


export type ClassesUpdateOneMutation = { __typename?: 'Mutation', ClassesUpdateOne?: { __typename?: 'UpdateByIdclassesPayload', recordId?: string | null, record?: { __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type ClassesDeleteOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type ClassesDeleteOneMutation = { __typename?: 'Mutation', ClassesDeleteOne?: string | null };

export type CurriculumsCreateOneMutationVariables = Exact<{
  record: CreateOnecurriculumsInput;
}>;


export type CurriculumsCreateOneMutation = { __typename?: 'Mutation', CurriculumsCreateOne?: { __typename?: 'CreateOnecurriculumsPayload', recordId?: string | null, record?: { __typename?: 'curriculums', _id: string, title?: string | null, slug?: string | null, active?: boolean | null, hidden?: boolean | null } | null, error?: never | null } | null };

export type CurriculumsUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdcurriculumsInput;
}>;


export type CurriculumsUpdateOneMutation = { __typename?: 'Mutation', CurriculumsUpdateOne?: { __typename?: 'UpdateByIdcurriculumsPayload', recordId?: string | null, record?: { __typename?: 'curriculums', _id: string, title?: string | null, slug?: string | null, active?: boolean | null, hidden?: boolean | null, description?: string | null, grade?: string | null, order?: number | null, cover?: { __typename?: 'curriculumsCover', type?: string | null, url?: string | null } | null, bgImage?: { __typename?: 'curriculumsBgImage', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type FeedbackCreateOneMutationVariables = Exact<{
  record: CreateOnefeedbackInput;
}>;


export type FeedbackCreateOneMutation = { __typename?: 'Mutation', FeedbackCreateOne?: { __typename?: 'CreateOnefeedbackPayload', recordId?: string | null, record?: { __typename?: 'feedback', _id: string, state?: string | null, comment?: string | null, class?: string | null, curriculum?: string | null, user?: string | null, createdAt?: any | null } | null, error?: never | null } | null };

export type GroupDeleteOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type GroupDeleteOneMutation = { __typename?: 'Mutation', GroupDeleteOne?: Array<string | null> | null };

export type GroupFinishedClassMutationVariables = Exact<{
  _id?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
}>;


export type GroupFinishedClassMutation = { __typename?: 'Mutation', GroupFinishedClass?: boolean | null };

export type ImpactCreateOneMutationVariables = Exact<{
  record: CreateOneimpactInput;
}>;


export type ImpactCreateOneMutation = { __typename?: 'Mutation', ImpactCreateOne?: { __typename?: 'CreateOneimpactPayload', recordId?: string | null, record?: { __typename?: 'impact', _id: string, type?: string | null, title?: string | null, description?: string | null, school?: string | null, user?: string | null, userType?: string | null, order?: number | null, deleted?: boolean | null, createdAt?: any | null, cover?: { __typename?: 'impactCover', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type TeacherGroupJournalCreateOneMutationVariables = Exact<{
  body: Scalars['String']['input'];
  question?: InputMaybe<Scalars['String']['input']>;
  group: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
}>;


export type TeacherGroupJournalCreateOneMutation = { __typename?: 'Mutation', TeacherGroupJournalCreateOne?: { __typename?: 'journals', _id: string } | null };

export type LessonCreateOneMutationVariables = Exact<{
  record: CreateOnelessonInput;
}>;


export type LessonCreateOneMutation = { __typename?: 'Mutation', LessonCreateOne?: { __typename?: 'CreateOnelessonPayload', recordId?: string | null, record?: { __typename?: 'lesson', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, curriculum?: string | null, classificationType?: Array<string | null> | null, cover?: { __typename?: 'lessonCover', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type LessonUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdlessonInput;
}>;


export type LessonUpdateOneMutation = { __typename?: 'Mutation', LessonUpdateOne?: { __typename?: 'UpdateByIdlessonPayload', recordId?: string | null, record?: { __typename?: 'lesson', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, curriculum?: string | null, classificationType?: Array<string | null> | null, cover?: { __typename?: 'lessonCover', type?: string | null, url?: string | null } | null } | null, error?: never | null } | null };

export type LessonDeleteOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type LessonDeleteOneMutation = { __typename?: 'Mutation', LessonDeleteOne?: string | null };

export type PinCreateOneMutationVariables = Exact<{
  record: CreateOnepinInput;
}>;


export type PinCreateOneMutation = { __typename?: 'Mutation', PinCreateOne?: { __typename?: 'CreateOnepinPayload', recordId?: string | null, record?: { __typename?: 'pin', _id: string, label?: string | null } | null, error?: never | null } | null };

export type PinUpdateOneMutationVariables = Exact<{
  filter?: InputMaybe<FilterUpdateManypinInput>;
  record: UpdateManypinInput;
}>;


export type PinUpdateOneMutation = { __typename?: 'Mutation', PinUpdateOne?: { __typename?: 'UpdateManypinPayload', numAffected?: number | null, error?: never | null } | null };

export type QuestionsCreateOneMutationVariables = Exact<{
  record: CreateOnequestionsInput;
}>;


export type QuestionsCreateOneMutation = { __typename?: 'Mutation', QuestionsCreateOne?: { __typename?: 'CreateOnequestionsPayload', recordId?: string | null, record?: { __typename?: 'questions', _id: string, label?: string | null } | null, error?: never | null } | null };

export type QuestionsUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdquestionsInput;
}>;


export type QuestionsUpdateOneMutation = { __typename?: 'Mutation', QuestionsUpdateOne?: { __typename?: 'UpdateByIdquestionsPayload', recordId?: string | null, record?: { __typename?: 'questions', _id: string, label?: string | null } | null, error?: never | null } | null };

export type TapCreateOneMutationVariables = Exact<{
  record: CreateOnetapInput;
}>;


export type TapCreateOneMutation = { __typename?: 'Mutation', TapCreateOne?: { __typename?: 'CreateOnetapPayload', recordId?: string | null, record?: { __typename?: 'tap', _id?: string | null, title?: string | null, order?: number | null } | null, error?: never | null } | null };

export type TapUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdtapInput;
}>;


export type TapUpdateOneMutation = { __typename?: 'Mutation', TapUpdateOne?: { __typename?: 'UpdateByIdtapPayload', recordId?: string | null, record?: { __typename?: 'tap', _id?: string | null, title?: string | null, order?: number | null, videos?: Array<{ __typename?: 'tapVideos', _id?: string | null } | null> | null } | null, error?: never | null } | null };

export type CreateUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  type: Scalars['String']['input'];
  organization?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  sendEmail?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', CreateUser?: string | null };

export type UserUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIduserInput;
}>;


export type UserUpdateOneMutation = { __typename?: 'Mutation', UserUpdateOne?: { __typename?: 'UpdateByIduserPayload', recordId?: string | null, record?: { __typename?: 'user', _id: string, firstName?: string | null, lastName?: string | null, email?: string | null, type?: string | null, organization?: string | null } | null, error?: never | null } | null };

export type DeleteUsersManyMutationVariables = Exact<{
  users?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  organization?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteUsersManyMutation = { __typename?: 'Mutation', DeleteUsersMany?: string | null };

export type UsersSetPasswordAdminMutationVariables = Exact<{
  user: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UsersSetPasswordAdminMutation = { __typename?: 'Mutation', UsersSetPasswordAdmin?: string | null };

export type SchoolUserDeleteOneMutationVariables = Exact<{
  school: Scalars['String']['input'];
  user: Scalars['String']['input'];
}>;


export type SchoolUserDeleteOneMutation = { __typename?: 'Mutation', SchoolUserDeleteOne: string };

export type SetUserSchoolMutationVariables = Exact<{
  school: Scalars['String']['input'];
  user: Scalars['String']['input'];
}>;


export type SetUserSchoolMutation = { __typename?: 'Mutation', SetUserSchool?: boolean | null };

export type OrganizationUserHistoryFindManyQueryVariables = Exact<{
  dateField: Scalars['String']['input'];
  organization?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrganizationUserHistoryFindManyQuery = { __typename?: 'Query', OrganizationUserHistoryFindMany?: Array<{ __typename?: 'DateUserCount', date: string, count: number } | null> | null };

export type UserTotalsFindManyQueryVariables = Exact<{
  district?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  global?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UserTotalsFindManyQuery = { __typename?: 'Query', UserTotalsFindMany?: { __typename?: 'UsersTotal', students?: number | null, teachers?: number | null, schools?: number | null, groups?: number | null, districts?: number | null } | null };

export type UsersSparksTotalsQueryVariables = Exact<{
  district?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
  global?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersSparksTotalsQuery = { __typename?: 'Query', UsersSparksTotals?: Array<{ __typename?: 'Sparks', date?: string | null, week?: number | null, month?: number | null, year?: number | null, dailyPoints?: number | null, weeklyPoints?: number | null, monthlyPoints?: number | null, total?: number | null } | null> | null };

export type GroupProgressByOrganizationFindManyQueryVariables = Exact<{
  organization: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type GroupProgressByOrganizationFindManyQuery = { __typename?: 'Query', GroupProgressByOrganizationFindMany?: Array<{ __typename?: 'groupprogress', _id: string, group?: string | null, curriculum?: string | null, progress?: number | null, finishedClasses?: Array<string | null> | null, finishedLesson?: Array<string | null> | null, nextClass?: string | null, nextLesson?: string | null, createdAt?: any | null, updatedAt?: any | null } | null> | null };

export type AnnouncementFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManyannouncementInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyannouncementInput>;
}>;


export type AnnouncementFindManyQuery = { __typename?: 'Query', AnnouncementFindMany: Array<{ __typename?: 'announcement', _id: string, message?: string | null, type?: string | null, active?: boolean | null, createdAt?: any | null }> };

export type MyLikedClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyLikedClassesQuery = { __typename?: 'Query', MyLikedClasses?: Array<{ __typename?: 'classlike', _id?: string | null, class: string, classObj?: { __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, cover?: { __typename?: 'classesCover', url?: string | null } | null } | null } | null> | null };

export type ClassesAdminFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManyclassesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortFindManyclassesInput> | SortFindManyclassesInput>;
}>;


export type ClassesAdminFindManyQuery = { __typename?: 'Query', ClassesAdminFindMany: Array<{ __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, feedback?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null, background?: { __typename?: 'classesBackground', type?: string | null, url?: string | null } | null, language?: { __typename?: 'classesLanguage', english?: { __typename?: 'classesLanguageEnglish', title?: string | null, description?: string | null } | null, spanish?: { __typename?: 'classesLanguageSpanish', title?: string | null, description?: string | null } | null } | null }> };

export type ClassesAdminFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOneclassesInput>;
}>;


export type ClassesAdminFindOneQuery = { __typename?: 'Query', ClassesAdminFindOne?: { __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null, background?: { __typename?: 'classesBackground', type?: string | null, url?: string | null } | null } | null };

export type ClassesByCurriculumFindOneQueryVariables = Exact<{
  curriculum: Scalars['String']['input'];
}>;


export type ClassesByCurriculumFindOneQuery = { __typename?: 'Query', ClassesByCurriculumFindOne?: Array<{ __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null, background?: { __typename?: 'classesBackground', type?: string | null, url?: string | null } | null, language?: { __typename?: 'classesLanguage', english?: { __typename?: 'classesLanguageEnglish', title?: string | null, description?: string | null } | null, spanish?: { __typename?: 'classesLanguageSpanish', title?: string | null, description?: string | null } | null } | null } | null> | null };

export type ClassesFindOneQueryVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type ClassesFindOneQuery = { __typename?: 'Query', ClassesFindOne?: { __typename?: 'classes', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, free?: boolean | null, feedback?: boolean | null, deleted?: boolean | null, curriculum?: string | null, cover?: { __typename?: 'classesCover', type?: string | null, url?: string | null } | null, background?: { __typename?: 'classesBackground', type?: string | null, url?: string | null } | null, language?: { __typename?: 'classesLanguage', english?: { __typename?: 'classesLanguageEnglish', title?: string | null, description?: string | null } | null, spanish?: { __typename?: 'classesLanguageSpanish', title?: string | null, description?: string | null } | null } | null } | null };

export type curriculumCollectionFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManycurriculumcollectionInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type curriculumCollectionFindManyQuery = { __typename?: 'Query', curriculumCollectionFindMany: Array<{ __typename?: 'curriculumcollection', _id: string, name?: string | null, slug?: string | null, description?: string | null, gradeLevel?: string | null, color?: string | null, active?: boolean | null, createdAt?: any | null, updatedAt?: any | null }> };

export type curriculumCollectionFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnecurriculumcollectionInput>;
}>;


export type curriculumCollectionFindOneQuery = { __typename?: 'Query', curriculumCollectionFindOne?: { __typename?: 'curriculumcollection', _id: string, name?: string | null, slug?: string | null, description?: string | null, gradeLevel?: string | null, color?: string | null, active?: boolean | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type curriculumCollectionCreateOneMutationVariables = Exact<{
  record: curriculumcollectionInput;
}>;


export type curriculumCollectionCreateOneMutation = { __typename?: 'Mutation', curriculumCollectionCreateOne?: { __typename?: 'curriculumcollection', _id: string, name?: string | null, slug?: string | null, description?: string | null, gradeLevel?: string | null, color?: string | null, active?: boolean | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type curriculumCollectionUpdateOneMutationVariables = Exact<{
  id: Scalars['String']['input'];
  record: curriculumcollectionInput;
}>;


export type curriculumCollectionUpdateOneMutation = { __typename?: 'Mutation', curriculumCollectionUpdateOne: string };

export type curriculumCollectionDeleteOneMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type curriculumCollectionDeleteOneMutation = { __typename?: 'Mutation', curriculumCollectionDeleteOne: string };

export type CurriculumsFindManyQueryVariables = Exact<{
  filter?: InputMaybe<curriculumsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<curriculumsSortEnum>;
}>;


export type CurriculumsFindManyQuery = { __typename?: 'Query', CurriculumsFindMany?: Array<{ __typename?: 'curriculums', _id: string, title?: string | null, description?: string | null, slug?: string | null, active?: boolean | null, hidden?: boolean | null, grade?: string | null, category?: string | null, order?: number | null, totalLesson?: number | null, curriculumCollection?: Array<{ __typename?: 'curriculumcollection', _id: string } | null> | null, cover?: { __typename?: 'curriculumsCover', type?: string | null, url?: string | null } | null, bgImage?: { __typename?: 'curriculumsBgImage', type?: string | null, url?: string | null } | null } | null> | null };

export type CurriculumsFindOneQueryVariables = Exact<{
  filter?: InputMaybe<curriculumsInput>;
}>;


export type CurriculumsFindOneQuery = { __typename?: 'Query', CurriculumsFindOne?: { __typename?: 'curriculums', _id: string, title?: string | null, description?: string | null, slug?: string | null, active?: boolean | null, hidden?: boolean | null, grade?: string | null, category?: string | null, order?: number | null, totalLesson?: number | null, curriculumCollection?: Array<{ __typename?: 'curriculumcollection', _id: string } | null> | null, cover?: { __typename?: 'curriculumsCover', type?: string | null, url?: string | null } | null, bgImage?: { __typename?: 'curriculumsBgImage', type?: string | null, url?: string | null } | null, language?: { __typename?: 'curriculumsLanguage', english?: { __typename?: 'curriculumsLanguageEnglish', title?: string | null, description?: string | null, identifier?: string | null, label?: string | null } | null, spanish?: { __typename?: 'curriculumsLanguageSpanish', title?: string | null, description?: string | null, identifier?: string | null, label?: string | null } | null } | null } | null };

export type DistrictFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManydistrictInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManydistrictInput>;
}>;


export type DistrictFindManyQuery = { __typename?: 'Query', DistrictFindMany: Array<{ __typename?: 'district', _id: string, name?: string | null, state?: string | null, country?: string | null, platform?: string | null, organization?: string | null, courses?: Array<string | null> | null, coursesCollections?: Array<string | null> | null, licenseLabel?: string | null, createdAt?: any | null, updatedAt?: any | null, coverPhoto?: { __typename?: 'districtCoverPhoto', type?: string | null, url?: string | null } | null, logo?: { __typename?: 'districtLogo', type?: string | null, url?: string | null } | null }> };

export type DistrictCreateOneMutationVariables = Exact<{
  record: CreateOnedistrictInput;
}>;


export type DistrictCreateOneMutation = { __typename?: 'Mutation', DistrictCreateOne?: { __typename?: 'CreateOnedistrictPayload', recordId?: string | null, error?: never | null, record?: { __typename?: 'district', _id: string, name?: string | null, state?: string | null, country?: string | null, platform?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type DistrictUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIddistrictInput;
}>;


export type DistrictUpdateOneMutation = { __typename?: 'Mutation', DistrictUpdateOne?: { __typename?: 'UpdateByIddistrictPayload', recordId?: string | null, error?: never | null, record?: { __typename?: 'district', _id: string, name?: string | null, state?: string | null, country?: string | null, platform?: string | null, organization?: string | null, courses?: Array<string | null> | null, coursesCollections?: Array<string | null> | null, licenseLabel?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type DistrictProfileFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManydistrictprofileInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DistrictProfileFindManyQuery = { __typename?: 'Query', DistrictProfileFindMany: Array<{ __typename?: 'districtprofile', _id: string, district?: string | null, city?: string | null, address?: string | null, website?: string | null, cover?: { __typename?: 'districtprofileCover', type?: string | null, url?: string | null } | null, logo?: { __typename?: 'districtprofileLogo', type?: string | null, url?: string | null } | null }> };

export type DistrictProfileFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnedistrictprofileInput>;
}>;


export type DistrictProfileFindOneQuery = { __typename?: 'Query', DistrictProfileFindOne?: { __typename?: 'districtprofile', _id: string, district?: string | null, city?: string | null, address?: string | null, website?: string | null, cover?: { __typename?: 'districtprofileCover', type?: string | null, url?: string | null } | null, logo?: { __typename?: 'districtprofileLogo', type?: string | null, url?: string | null } | null } | null };

export type DistrictFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnedistrictInput>;
}>;


export type DistrictFindOneQuery = { __typename?: 'Query', DistrictFindOne?: { __typename?: 'district', _id: string, name?: string | null, organization?: string | null, coverPhoto?: { __typename?: 'districtCoverPhoto', type?: string | null, url?: string | null } | null, logo?: { __typename?: 'districtLogo', type?: string | null, url?: string | null } | null } | null };

export type DistrictProfileCreateOneMutationVariables = Exact<{
  record?: InputMaybe<districtprofileInput>;
}>;


export type DistrictProfileCreateOneMutation = { __typename?: 'Mutation', DistrictProfileCreateOne?: { __typename?: 'districtprofile', _id: string, district?: string | null, city?: string | null, address?: string | null, website?: string | null, cover?: { __typename?: 'districtprofileCover', type?: string | null, url?: string | null } | null, logo?: { __typename?: 'districtprofileLogo', type?: string | null, url?: string | null } | null } | null };

export type DistrictProfileUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record?: InputMaybe<districtprofileInput>;
}>;


export type DistrictProfileUpdateOneMutation = { __typename?: 'Mutation', DistrictProfileUpdateOne: string };

export type UserDistrictFindOneQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDistrictFindOneQuery = { __typename?: 'Query', UserDistrictFindOne?: { __typename?: 'district', _id: string, name?: string | null, state?: string | null, country?: string | null, organization?: string | null, platform?: string | null, exemptionDates?: Array<any | null> | null, extraCourse?: boolean | null, slug?: string | null, courses?: Array<string | null> | null, coursesCollections?: Array<string | null> | null, licenseLabel?: string | null, address?: string | null, website?: string | null, city?: string | null, deletedAt?: any | null, createdAt?: any | null, updatedAt?: any | null, coverPhoto?: { __typename?: 'districtCoverPhoto', url?: string | null, type?: string | null } | null, logo?: { __typename?: 'districtLogo', url?: string | null, type?: string | null } | null } | null };

export type FeedbackFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnefeedbackInput>;
}>;


export type FeedbackFindOneQuery = { __typename?: 'Query', FeedbackFindOne?: { __typename?: 'feedback', _id: string, state?: string | null, comment?: string | null } | null };

export type GroupFindManyQueryVariables = Exact<{
  filter?: InputMaybe<groupsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GroupFindManyQuery = { __typename?: 'Query', GroupFindMany?: Array<{ __typename?: 'groups', _id: string, name?: string | null, grade?: string | null, manager?: string | null, organization?: string | null, platform?: string | null, curriculums?: Array<string | null> | null, cover?: { __typename?: 'groupsCover', url?: string | null, type?: string | null } | null, managerObj?: { __typename?: 'userPayment', _id?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null } | null } | null> | null };

export type GroupFindOneQueryVariables = Exact<{
  filter?: InputMaybe<groupsInput>;
}>;


export type GroupFindOneQuery = { __typename?: 'Query', GroupFindOne?: { __typename?: 'groups', _id: string, name?: string | null, grade?: string | null, manager?: string | null, organization?: string | null, platform?: string | null, curriculumsObj?: Array<{ __typename?: 'curriculumsPayment', _id: string, title?: string | null, slug?: string | null, order?: number | null, grade?: string | null, totalLesson?: number | null, cover?: { __typename?: 'curriculumsPaymentCover', type?: string | null, url?: string | null } | null, bgImage?: { __typename?: 'curriculumsPaymentBgImage', type?: string | null, url?: string | null } | null, language?: { __typename?: 'curriculumsPaymentLanguage', english?: { __typename?: 'curriculumsPaymentLanguageEnglish', title?: string | null, description?: string | null } | null, spanish?: { __typename?: 'curriculumsPaymentLanguageSpanish', title?: string | null, description?: string | null } | null } | null } | null> | null } | null };

export type GroupProgressFindOneQueryVariables = Exact<{
  filter?: InputMaybe<groupprogressInput>;
}>;


export type GroupProgressFindOneQuery = { __typename?: 'Query', GroupProgressFindOne?: { __typename?: 'groupprogress', _id: string, group?: string | null, curriculum?: string | null, progress?: number | null, finishedClasses?: Array<string | null> | null, nextClass?: string | null } | null };

export type GroupCreateOneMutationVariables = Exact<{
  name: Scalars['String']['input'];
  teacher?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  curriculums?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type GroupCreateOneMutation = { __typename?: 'Mutation', GroupCreateOne?: { __typename?: 'groups', _id: string, name?: string | null, manager?: string | null, organization?: string | null, platform?: string | null, curriculums?: Array<string | null> | null } | null };

export type ImpactFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManyimpactInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ImpactFindManyQuery = { __typename?: 'Query', ImpactFindMany: Array<{ __typename?: 'impact', _id: string, type?: string | null, title?: string | null, description?: string | null, school?: string | null, user?: string | null, userType?: string | null, order?: number | null, deleted?: boolean | null, createdAt?: any | null, cover?: { __typename?: 'impactCover', type?: string | null, url?: string | null } | null }> };

export type JournalsFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnejournalsInput>;
}>;


export type JournalsFindOneQuery = { __typename?: 'Query', JournalsFindOne?: { __typename?: 'journals', _id: string, body?: string | null } | null };

export type JournalsFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManyjournalsInput>;
  sort?: InputMaybe<SortFindManyjournalsInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type JournalsFindManyQuery = { __typename?: 'Query', JournalsFindMany: Array<{ __typename?: 'journals', _id: string, body?: string | null, question?: string | null, createdAt?: any | null, documents?: Array<{ __typename?: 'journalsDocuments', title?: string | null, type?: string | null, url?: string | null } | null> | null }> };

export type LessonFindManyQueryVariables = Exact<{
  filter?: InputMaybe<lessonInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<lessonSortEnumTC>;
}>;


export type LessonFindManyQuery = { __typename?: 'Query', LessonFindMany?: Array<{ __typename?: 'lesson', _id?: string | null, title?: string | null, description?: string | null, order?: number | null, class?: string | null, curriculum?: string | null, classificationType?: Array<string | null> | null, lifeSkill?: Array<string | null> | null, deleted?: boolean | null, cover?: { __typename?: 'lessonCover', type?: string | null, url?: string | null } | null } | null> | null };

export type LicensePresetFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManylicensepresetInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManylicensepresetInput>;
}>;


export type LicensePresetFindManyQuery = { __typename?: 'Query', LicensePresetFindMany: Array<{ __typename?: 'licensepreset', _id: string, identifier?: string | null, label?: string | null, description?: string | null, platform?: string | null, courses?: Array<string | null> | null, coursesCollection?: Array<string | null> | null, createdAt?: any | null, updatedAt?: any | null }> };

export type LicensePresetFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnelicensepresetInput>;
}>;


export type LicensePresetFindOneQuery = { __typename?: 'Query', LicensePresetFindOne?: { __typename?: 'licensepreset', _id: string, identifier?: string | null, label?: string | null, description?: string | null, platform?: string | null, courses?: Array<string | null> | null, coursesCollection?: Array<string | null> | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type LicensePresetCreateOneMutationVariables = Exact<{
  record: CreateOnelicensepresetInput;
}>;


export type LicensePresetCreateOneMutation = { __typename?: 'Mutation', LicensePresetCreateOne?: { __typename?: 'CreateOnelicensepresetPayload', recordId?: string | null, record?: { __typename?: 'licensepreset', _id: string, identifier?: string | null, label?: string | null, description?: string | null, platform?: string | null, courses?: Array<string | null> | null, coursesCollection?: Array<string | null> | null, createdAt?: any | null, updatedAt?: any | null } | null, error?: never | null } | null };

export type LicensePresetUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdlicensepresetInput;
}>;


export type LicensePresetUpdateOneMutation = { __typename?: 'Mutation', LicensePresetUpdateOne?: { __typename?: 'UpdateByIdlicensepresetPayload', recordId?: string | null, record?: { __typename?: 'licensepreset', _id: string, identifier?: string | null, label?: string | null, description?: string | null, platform?: string | null, courses?: Array<string | null> | null, coursesCollection?: Array<string | null> | null, createdAt?: any | null, updatedAt?: any | null } | null, error?: never | null } | null };

export type LicensePresetDeleteOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
}>;


export type LicensePresetDeleteOneMutation = { __typename?: 'Mutation', LicensePresetDeleteOne?: string | null };

export type narratorsFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManynarratorsInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type narratorsFindManyQuery = { __typename?: 'Query', narratorsFindMany: Array<{ __typename?: 'narrators', _id: string, name?: string | null, bio?: string | null, languages?: Array<string | null> | null, active?: boolean | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, avatar?: { __typename?: 'narratorsAvatar', url?: string | null, type?: string | null } | null }> };

export type narratorsFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnenarratorsInput>;
}>;


export type narratorsFindOneQuery = { __typename?: 'Query', narratorsFindOne?: { __typename?: 'narrators', _id: string, name?: string | null, bio?: string | null, languages?: Array<string | null> | null, active?: boolean | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, avatar?: { __typename?: 'narratorsAvatar', url?: string | null, type?: string | null } | null } | null };

export type narratorsCreateOneMutationVariables = Exact<{
  record: CreateOnenarratorsInput;
}>;


export type narratorsCreateOneMutation = { __typename?: 'Mutation', narratorsCreateOne?: { __typename?: 'CreateOnenarratorsPayload', recordId?: string | null, record?: { __typename?: 'narrators', _id: string, name?: string | null, bio?: string | null, languages?: Array<string | null> | null, active?: boolean | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, avatar?: { __typename?: 'narratorsAvatar', url?: string | null, type?: string | null } | null } | null, error?: never | null } | null };

export type narratorsUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdnarratorsInput;
}>;


export type narratorsUpdateOneMutation = { __typename?: 'Mutation', narratorsUpdateOne?: { __typename?: 'UpdateByIdnarratorsPayload', recordId?: string | null, record?: { __typename?: 'narrators', _id: string, name?: string | null, bio?: string | null, languages?: Array<string | null> | null, active?: boolean | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, avatar?: { __typename?: 'narratorsAvatar', url?: string | null, type?: string | null } | null } | null, error?: never | null } | null };

export type narratorsDeleteOneMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type narratorsDeleteOneMutation = { __typename?: 'Mutation', narratorsDeleteOne?: string | null };

export type MyOrganizationFindOneQueryVariables = Exact<{ [key: string]: never; }>;


export type MyOrganizationFindOneQuery = { __typename?: 'Query', MyOrganizationFindOne?: { __typename?: 'organization', _id: string, name?: string | null, code?: string | null, platform?: string | null } | null };

export type PinFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManypinInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManypinInput>;
}>;


export type PinFindManyQuery = { __typename?: 'Query', PinFindMany: Array<{ __typename?: 'pin', _id: string, label?: string | null, class?: string | null, curriculum?: string | null, platform?: string | null, order?: number | null, deletedAt?: any | null, cover?: { __typename?: 'pinCover', type?: string | null, url?: string | null } | null, video?: { __typename?: 'pinVideo', type?: string | null, url?: string | null } | null }> };

export type PinFindOneQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindOnepinInput>;
}>;


export type PinFindOneQuery = { __typename?: 'Query', PinFindOne?: { __typename?: 'pin', _id: string, label?: string | null, class?: string | null, curriculum?: string | null, platform?: string | null, order?: number | null, deletedAt?: any | null, cover?: { __typename?: 'pinCover', type?: string | null, url?: string | null } | null, video?: { __typename?: 'pinVideo', type?: string | null, url?: string | null } | null } | null };

export type QuestionsFindManyQueryVariables = Exact<{
  filter?: InputMaybe<questionsInput>;
}>;


export type QuestionsFindManyQuery = { __typename?: 'Query', QuestionsFindMany?: Array<{ __typename?: 'questions', _id: string, label?: string | null, platform?: string | null } | null> | null };

export type SchoolFindManyQueryVariables = Exact<{
  filter?: InputMaybe<schoolsDataInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SchoolFindManyQuery = { __typename?: 'Query', SchoolFindMany?: Array<{ __typename?: 'schoolsData', _id: string, name?: string | null, district?: string | null, city?: string | null, state?: string | null, country?: string | null, platform?: string | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null } | null> | null };

export type SchoolFindOneQueryVariables = Exact<{
  filter?: InputMaybe<schoolsDataInput>;
}>;


export type SchoolFindOneQuery = { __typename?: 'Query', SchoolFindOne?: { __typename?: 'schoolsData', _id: string, name?: string | null, district?: string | null, city?: string | null, state?: string | null, country?: string | null, platform?: string | null, createdAt?: any | null, deletedAt?: any | null } | null };

export type SchoolByUsersFindManyQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']['input']>;
}>;


export type SchoolByUsersFindManyQuery = { __typename?: 'Query', SchoolByUsersFindMany?: Array<{ __typename?: 'schoolsData', _id: string, name?: string | null } | null> | null };

export type SchoolCreateOneMutationVariables = Exact<{
  record: CreateOneschoolsDataInput;
}>;


export type SchoolCreateOneMutation = { __typename?: 'Mutation', SchoolCreateOne?: { __typename?: 'CreateOneschoolsDataPayload', recordId?: string | null, error?: never | null, record?: { __typename?: 'schoolsData', _id: string, name?: string | null, district?: string | null, state?: string | null, country?: string | null, platform?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type SchoolUpdateOneMutationVariables = Exact<{
  _id: Scalars['String']['input'];
  record: UpdateByIdschoolsDataInput;
}>;


export type SchoolUpdateOneMutation = { __typename?: 'Mutation', SchoolUpdateOne?: { __typename?: 'UpdateByIdschoolsDataPayload', recordId?: string | null, error?: never | null, record?: { __typename?: 'schoolsData', _id: string, name?: string | null, district?: string | null, state?: string | null, country?: string | null, platform?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } | null };

export type TapFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManytapInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManytapInput>;
}>;


export type TapFindManyQuery = { __typename?: 'Query', TapFindMany: Array<{ __typename?: 'tap', _id?: string | null, class?: string | null, title?: string | null, order?: number | null, type?: string | null, language?: string | null, points?: number | null, intro?: string | null, description?: string | null, platform?: string | null, slug?: string | null, deleted?: boolean | null, time?: number | null, createdAt?: any | null, updatedAt?: any | null, cover?: { __typename?: 'tapCover', url?: string | null, type?: string | null } | null, videos?: Array<{ __typename?: 'tapVideos', _id?: string | null, url?: string | null, skip?: number | null, type?: string | null, narrator?: Array<string | null> | null, thumbnail?: { __typename?: 'tapVideosThumbnail', url?: string | null, type?: string | null } | null, captions?: Array<{ __typename?: 'tapVideosCaptions', language?: string | null, available?: boolean | null, file?: { __typename?: 'tapVideosCaptionsFile', url?: string | null } | null } | null> | null } | null> | null, extraQuestions?: Array<{ __typename?: 'tapExtraQuestions', question?: string | null, points?: number | null } | null> | null }> };

export type TapTypeFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManytaptypeInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManytaptypeInput>;
}>;


export type TapTypeFindManyQuery = { __typename?: 'Query', TapTypeFindMany: Array<{ __typename?: 'taptype', _id: string, identifier?: string | null, label?: string | null }> };

export type UsersFindOneQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersFindOneQuery = { __typename?: 'Query', UsersFindOne?: { __typename?: 'user', _id: string, firstName?: string | null, lastName?: string | null, email?: string | null, userName?: string | null, createdAt?: any | null, type?: string | null, organization?: string | null, platform?: string | null, typeObj?: { __typename?: 'usertypes', identifier?: string | null } | null, profilePicture?: { __typename?: 'userProfilePicture', url?: string | null } | null } | null };

export type UserSearchQueryVariables = Exact<{
  districtId?: InputMaybe<Scalars['String']['input']>;
  schoolId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  platformId?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UserSearchQuery = { __typename?: 'Query', UserSearch?: { __typename?: 'UsersSearch', total: number, data?: Array<{ __typename?: 'UserWithSchool', userId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, organization_id?: string | null, organization_name?: string | null, type_id?: string | null, type_name?: string | null, createdAt?: string | null, updatedAt?: string | null, lastLogin?: string | null, schools?: Array<{ __typename?: 'UserWithSchool_Schools', school_id?: string | null, school_name?: string | null, region_id?: string | null, region_name?: string | null } | null> | null, groups?: Array<{ __typename?: 'UserWithSchool_Groups', group_id?: string | null, group_name?: string | null } | null> | null } | null> | null } | null };

export type UsersByOrganizationTotalQueryVariables = Exact<{
  organization: Scalars['String']['input'];
}>;


export type UsersByOrganizationTotalQuery = { __typename?: 'Query', UsersByOrganizationFindMany?: { __typename?: 'UsersTotalObj', total: number } | null };

export type UserTypesFindManyQueryVariables = Exact<{
  filter?: InputMaybe<FilterFindManyusertypesInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortFindManyusertypesInput>;
}>;


export type UserTypesFindManyQuery = { __typename?: 'Query', UserTypesFindMany: Array<{ __typename?: 'usertypes', _id: string, identifier?: string | null, label?: string | null }> };


export const PingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]} as unknown as DocumentNode<PingQuery, PingQueryVariables>;
export const AnnouncementCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AnnouncementCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneannouncementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AnnouncementCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<AnnouncementCreateOneMutation, AnnouncementCreateOneMutationVariables>;
export const AnnouncementUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AnnouncementUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdannouncementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AnnouncementUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<AnnouncementUpdateOneMutation, AnnouncementUpdateOneMutationVariables>;
export const AnnouncementDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AnnouncementDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AnnouncementDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}]}}]} as unknown as DocumentNode<AnnouncementDeleteOneMutation, AnnouncementDeleteOneMutationVariables>;
export const ClassLikeCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassLikeCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassLikeCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"class"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<ClassLikeCreateOneMutation, ClassLikeCreateOneMutationVariables>;
export const ClassLikeDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassLikeDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassLikeDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"class"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class"}}}]}]}}]} as unknown as DocumentNode<ClassLikeDeleteOneMutation, ClassLikeDeleteOneMutationVariables>;
export const ClassesCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassesCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneclassesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassesCreateOneMutation, ClassesCreateOneMutationVariables>;
export const ClassesUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassesUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdclassesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassesUpdateOneMutation, ClassesUpdateOneMutationVariables>;
export const ClassesDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassesDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}]}}]} as unknown as DocumentNode<ClassesDeleteOneMutation, ClassesDeleteOneMutationVariables>;
export const CurriculumsCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CurriculumsCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnecurriculumsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CurriculumsCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CurriculumsCreateOneMutation, CurriculumsCreateOneMutationVariables>;
export const CurriculumsUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CurriculumsUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdcurriculumsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CurriculumsUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bgImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CurriculumsUpdateOneMutation, CurriculumsUpdateOneMutationVariables>;
export const FeedbackCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FeedbackCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnefeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FeedbackCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<FeedbackCreateOneMutation, FeedbackCreateOneMutationVariables>;
export const GroupDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}]}}]} as unknown as DocumentNode<GroupDeleteOneMutation, GroupDeleteOneMutationVariables>;
export const GroupFinishedClassDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupFinishedClass"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupFinishedClass"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"class"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class"}}}]}]}}]} as unknown as DocumentNode<GroupFinishedClassMutation, GroupFinishedClassMutationVariables>;
export const ImpactCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImpactCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneimpactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ImpactCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"school"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ImpactCreateOneMutation, ImpactCreateOneMutationVariables>;
export const TeacherGroupJournalCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherGroupJournalCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"question"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"group"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TeacherGroupJournalCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"question"},"value":{"kind":"Variable","name":{"kind":"Name","value":"question"}}},{"kind":"Argument","name":{"kind":"Name","value":"group"},"value":{"kind":"Variable","name":{"kind":"Name","value":"group"}}},{"kind":"Argument","name":{"kind":"Name","value":"class"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<TeacherGroupJournalCreateOneMutation, TeacherGroupJournalCreateOneMutationVariables>;
export const LessonCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LessonCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnelessonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LessonCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"classificationType"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LessonCreateOneMutation, LessonCreateOneMutationVariables>;
export const LessonUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LessonUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdlessonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LessonUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"classificationType"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LessonUpdateOneMutation, LessonUpdateOneMutationVariables>;
export const LessonDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LessonDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LessonDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}]}}]} as unknown as DocumentNode<LessonDeleteOneMutation, LessonDeleteOneMutationVariables>;
export const PinCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnepinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PinCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PinCreateOneMutation, PinCreateOneMutationVariables>;
export const PinUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUpdateManypinInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateManypinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PinUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numAffected"}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PinUpdateOneMutation, PinUpdateOneMutationVariables>;
export const QuestionsCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"QuestionsCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnequestionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"QuestionsCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<QuestionsCreateOneMutation, QuestionsCreateOneMutationVariables>;
export const QuestionsUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"QuestionsUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdquestionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"QuestionsUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<QuestionsUpdateOneMutation, QuestionsUpdateOneMutationVariables>;
export const TapCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TapCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnetapInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TapCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TapCreateOneMutation, TapCreateOneMutationVariables>;
export const TapUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TapUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdtapInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TapUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TapUpdateOneMutation, TapUpdateOneMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sendEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"sendEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sendEmail"}}}]}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UserUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIduserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UserUpdateOneMutation, UserUpdateOneMutationVariables>;
export const DeleteUsersManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUsersMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeleteUsersMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"school"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}}]}]}}]} as unknown as DocumentNode<DeleteUsersManyMutation, DeleteUsersManyMutationVariables>;
export const UsersSetPasswordAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsersSetPasswordAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UsersSetPasswordAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<UsersSetPasswordAdminMutation, UsersSetPasswordAdminMutationVariables>;
export const SchoolUserDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolUserDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolUserDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"school"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}]}}]} as unknown as DocumentNode<SchoolUserDeleteOneMutation, SchoolUserDeleteOneMutationVariables>;
export const SetUserSchoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetUserSchool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SetUserSchool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"school"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}]}}]} as unknown as DocumentNode<SetUserSchoolMutation, SetUserSchoolMutationVariables>;
export const OrganizationUserHistoryFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationUserHistoryFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateField"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OrganizationUserHistoryFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateField"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateField"}}},{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<OrganizationUserHistoryFindManyQuery, OrganizationUserHistoryFindManyQueryVariables>;
export const UserTotalsFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserTotalsFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"district"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"global"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserTotalsFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"district"},"value":{"kind":"Variable","name":{"kind":"Name","value":"district"}}},{"kind":"Argument","name":{"kind":"Name","value":"school"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}},{"kind":"Argument","name":{"kind":"Name","value":"global"},"value":{"kind":"Variable","name":{"kind":"Name","value":"global"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"students"}},{"kind":"Field","name":{"kind":"Name","value":"teachers"}},{"kind":"Field","name":{"kind":"Name","value":"schools"}},{"kind":"Field","name":{"kind":"Name","value":"groups"}},{"kind":"Field","name":{"kind":"Name","value":"districts"}}]}}]}}]} as unknown as DocumentNode<UserTotalsFindManyQuery, UserTotalsFindManyQueryVariables>;
export const UsersSparksTotalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersSparksTotals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"district"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"group"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"global"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UsersSparksTotals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"district"},"value":{"kind":"Variable","name":{"kind":"Name","value":"district"}}},{"kind":"Argument","name":{"kind":"Name","value":"school"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}},{"kind":"Argument","name":{"kind":"Name","value":"group"},"value":{"kind":"Variable","name":{"kind":"Name","value":"group"}}},{"kind":"Argument","name":{"kind":"Name","value":"global"},"value":{"kind":"Variable","name":{"kind":"Name","value":"global"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"dailyPoints"}},{"kind":"Field","name":{"kind":"Name","value":"weeklyPoints"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPoints"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<UsersSparksTotalsQuery, UsersSparksTotalsQueryVariables>;
export const GroupProgressByOrganizationFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupProgressByOrganizationFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupProgressByOrganizationFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"finishedClasses"}},{"kind":"Field","name":{"kind":"Name","value":"finishedLesson"}},{"kind":"Field","name":{"kind":"Name","value":"nextClass"}},{"kind":"Field","name":{"kind":"Name","value":"nextLesson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GroupProgressByOrganizationFindManyQuery, GroupProgressByOrganizationFindManyQueryVariables>;
export const AnnouncementFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AnnouncementFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManyannouncementInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManyannouncementInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AnnouncementFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AnnouncementFindManyQuery, AnnouncementFindManyQueryVariables>;
export const MyLikedClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyLikedClasses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MyLikedClasses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"classObj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyLikedClassesQuery, MyLikedClassesQueryVariables>;
export const ClassesAdminFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassesAdminFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManyclassesInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManyclassesInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesAdminFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spanish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassesAdminFindManyQuery, ClassesAdminFindManyQueryVariables>;
export const ClassesAdminFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassesAdminFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOneclassesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesAdminFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ClassesAdminFindOneQuery, ClassesAdminFindOneQueryVariables>;
export const ClassesByCurriculumFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassesByCurriculumFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"curriculum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesByCurriculumFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"curriculum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"curriculum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spanish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassesByCurriculumFindOneQuery, ClassesByCurriculumFindOneQueryVariables>;
export const ClassesFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassesFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ClassesFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spanish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassesFindOneQuery, ClassesFindOneQueryVariables>;
export const curriculumCollectionFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"curriculumCollectionFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManycurriculumcollectionInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"curriculumCollectionFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gradeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<curriculumCollectionFindManyQuery, curriculumCollectionFindManyQueryVariables>;
export const curriculumCollectionFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"curriculumCollectionFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnecurriculumcollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"curriculumCollectionFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gradeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<curriculumCollectionFindOneQuery, curriculumCollectionFindOneQueryVariables>;
export const curriculumCollectionCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"curriculumCollectionCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"curriculumcollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"curriculumCollectionCreateOne"},"name":{"kind":"Name","value":"CurriculumCollectionCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gradeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<curriculumCollectionCreateOneMutation, curriculumCollectionCreateOneMutationVariables>;
export const curriculumCollectionUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"curriculumCollectionUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"curriculumcollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"curriculumCollectionUpdateOne"},"name":{"kind":"Name","value":"CurriculumCollectionUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}]}]}}]} as unknown as DocumentNode<curriculumCollectionUpdateOneMutation, curriculumCollectionUpdateOneMutationVariables>;
export const curriculumCollectionDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"curriculumCollectionDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"curriculumCollectionDeleteOne"},"name":{"kind":"Name","value":"CurriculumCollectionDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<curriculumCollectionDeleteOneMutation, curriculumCollectionDeleteOneMutationVariables>;
export const CurriculumsFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurriculumsFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"curriculumsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"curriculumsSortEnum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CurriculumsFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"totalLesson"}},{"kind":"Field","name":{"kind":"Name","value":"curriculumCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bgImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<CurriculumsFindManyQuery, CurriculumsFindManyQueryVariables>;
export const CurriculumsFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurriculumsFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"curriculumsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CurriculumsFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"totalLesson"}},{"kind":"Field","name":{"kind":"Name","value":"curriculumCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bgImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spanish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CurriculumsFindOneQuery, CurriculumsFindOneQueryVariables>;
export const DistrictFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DistrictFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManydistrictInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManydistrictInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollections"}},{"kind":"Field","name":{"kind":"Name","value":"licenseLabel"}},{"kind":"Field","name":{"kind":"Name","value":"coverPhoto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DistrictFindManyQuery, DistrictFindManyQueryVariables>;
export const DistrictCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DistrictCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnedistrictInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}}]}}]}}]} as unknown as DocumentNode<DistrictCreateOneMutation, DistrictCreateOneMutationVariables>;
export const DistrictUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DistrictUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIddistrictInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollections"}},{"kind":"Field","name":{"kind":"Name","value":"licenseLabel"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}}]}}]}}]} as unknown as DocumentNode<DistrictUpdateOneMutation, DistrictUpdateOneMutationVariables>;
export const DistrictProfileFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DistrictProfileFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManydistrictprofileInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictProfileFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DistrictProfileFindManyQuery, DistrictProfileFindManyQueryVariables>;
export const DistrictProfileFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DistrictProfileFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnedistrictprofileInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictProfileFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DistrictProfileFindOneQuery, DistrictProfileFindOneQueryVariables>;
export const DistrictFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DistrictFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnedistrictInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"coverPhoto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DistrictFindOneQuery, DistrictFindOneQueryVariables>;
export const DistrictProfileCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DistrictProfileCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"districtprofileInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictProfileCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DistrictProfileCreateOneMutation, DistrictProfileCreateOneMutationVariables>;
export const DistrictProfileUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DistrictProfileUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"districtprofileInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistrictProfileUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}]}]}}]} as unknown as DocumentNode<DistrictProfileUpdateOneMutation, DistrictProfileUpdateOneMutationVariables>;
export const UserDistrictFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDistrictFindOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserDistrictFindOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"exemptionDates"}},{"kind":"Field","name":{"kind":"Name","value":"extraCourse"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollections"}},{"kind":"Field","name":{"kind":"Name","value":"licenseLabel"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"coverPhoto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UserDistrictFindOneQuery, UserDistrictFindOneQueryVariables>;
export const FeedbackFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FeedbackFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnefeedbackInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FeedbackFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]} as unknown as DocumentNode<FeedbackFindOneQuery, FeedbackFindOneQueryVariables>;
export const GroupFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"groupsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"manager"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"curriculums"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"managerObj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GroupFindManyQuery, GroupFindManyQueryVariables>;
export const GroupFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"groupsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"manager"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"curriculumsObj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"totalLesson"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bgImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spanish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GroupFindOneQuery, GroupFindOneQueryVariables>;
export const GroupProgressFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupProgressFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"groupprogressInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupProgressFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"finishedClasses"}},{"kind":"Field","name":{"kind":"Name","value":"nextClass"}}]}}]}}]} as unknown as DocumentNode<GroupProgressFindOneQuery, GroupProgressFindOneQueryVariables>;
export const GroupCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"curriculums"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GroupCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacher"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"curriculums"},"value":{"kind":"Variable","name":{"kind":"Name","value":"curriculums"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"manager"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"curriculums"}}]}}]}}]} as unknown as DocumentNode<GroupCreateOneMutation, GroupCreateOneMutationVariables>;
export const ImpactFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImpactFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManyimpactInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ImpactFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"school"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ImpactFindManyQuery, ImpactFindManyQueryVariables>;
export const JournalsFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalsFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnejournalsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"JournalsFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}}]} as unknown as DocumentNode<JournalsFindOneQuery, JournalsFindOneQueryVariables>;
export const JournalsFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JournalsFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManyjournalsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManyjournalsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"JournalsFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<JournalsFindManyQuery, JournalsFindManyQueryVariables>;
export const LessonFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LessonFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"lessonInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"lessonSortEnumTC"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LessonFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"classificationType"}},{"kind":"Field","name":{"kind":"Name","value":"lifeSkill"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<LessonFindManyQuery, LessonFindManyQueryVariables>;
export const LicensePresetFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LicensePresetFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManylicensepresetInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManylicensepresetInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicensePresetFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollection"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<LicensePresetFindManyQuery, LicensePresetFindManyQueryVariables>;
export const LicensePresetFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LicensePresetFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnelicensepresetInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicensePresetFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollection"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<LicensePresetFindOneQuery, LicensePresetFindOneQueryVariables>;
export const LicensePresetCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LicensePresetCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnelicensepresetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicensePresetCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollection"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LicensePresetCreateOneMutation, LicensePresetCreateOneMutationVariables>;
export const LicensePresetUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LicensePresetUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdlicensepresetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicensePresetUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"courses"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCollection"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LicensePresetUpdateOneMutation, LicensePresetUpdateOneMutationVariables>;
export const LicensePresetDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LicensePresetDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicensePresetDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}]}}]} as unknown as DocumentNode<LicensePresetDeleteOneMutation, LicensePresetDeleteOneMutationVariables>;
export const narratorsFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"narratorsFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManynarratorsInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"narratorsFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<narratorsFindManyQuery, narratorsFindManyQueryVariables>;
export const narratorsFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"narratorsFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnenarratorsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"narratorsFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<narratorsFindOneQuery, narratorsFindOneQueryVariables>;
export const narratorsCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"narratorsCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOnenarratorsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"narratorsCreateOne"},"name":{"kind":"Name","value":"NarratorsCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<narratorsCreateOneMutation, narratorsCreateOneMutationVariables>;
export const narratorsUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"narratorsUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdnarratorsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"narratorsUpdateOne"},"name":{"kind":"Name","value":"NarratorsUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<narratorsUpdateOneMutation, narratorsUpdateOneMutationVariables>;
export const narratorsDeleteOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"narratorsDeleteOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"narratorsDeleteOne"},"name":{"kind":"Name","value":"NarratorsDeleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<narratorsDeleteOneMutation, narratorsDeleteOneMutationVariables>;
export const MyOrganizationFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyOrganizationFindOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MyOrganizationFindOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}}]}}]}}]} as unknown as DocumentNode<MyOrganizationFindOneQuery, MyOrganizationFindOneQueryVariables>;
export const PinFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PinFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManypinInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManypinInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PinFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<PinFindManyQuery, PinFindManyQueryVariables>;
export const PinFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PinFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindOnepinInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PinFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"curriculum"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<PinFindOneQuery, PinFindOneQueryVariables>;
export const QuestionsFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuestionsFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"questionsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"QuestionsFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}}]}}]}}]} as unknown as DocumentNode<QuestionsFindManyQuery, QuestionsFindManyQueryVariables>;
export const SchoolFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"schoolsDataInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<SchoolFindManyQuery, SchoolFindManyQueryVariables>;
export const SchoolFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"schoolsDataInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<SchoolFindOneQuery, SchoolFindOneQueryVariables>;
export const SchoolByUsersFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolByUsersFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolByUsersFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SchoolByUsersFindManyQuery, SchoolByUsersFindManyQueryVariables>;
export const SchoolCreateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolCreateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneschoolsDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolCreateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}}]}}]}}]} as unknown as DocumentNode<SchoolCreateOneMutation, SchoolCreateOneMutationVariables>;
export const SchoolUpdateOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolUpdateOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"record"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateByIdschoolsDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SchoolUpdateOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"record"},"value":{"kind":"Variable","name":{"kind":"Name","value":"record"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"record"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}}]}}]}}]} as unknown as DocumentNode<SchoolUpdateOneMutation, SchoolUpdateOneMutationVariables>;
export const TapFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TapFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManytapInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManytapInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TapFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"intro"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"narrator"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"captions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"extraQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]}}]}}]} as unknown as DocumentNode<TapFindManyQuery, TapFindManyQueryVariables>;
export const TapTypeFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TapTypeFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManytaptypeInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManytaptypeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TapTypeFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]} as unknown as DocumentNode<TapTypeFindManyQuery, TapTypeFindManyQueryVariables>;
export const UsersFindOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersFindOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UsersFindOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"typeObj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<UsersFindOneQuery, UsersFindOneQueryVariables>;
export const UserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"districtId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platformId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"districtId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"districtId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"platformId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platformId"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organization_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization_name"}},{"kind":"Field","name":{"kind":"Name","value":"type_id"}},{"kind":"Field","name":{"kind":"Name","value":"type_name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"schools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school_id"}},{"kind":"Field","name":{"kind":"Name","value":"school_name"}},{"kind":"Field","name":{"kind":"Name","value":"region_id"}},{"kind":"Field","name":{"kind":"Name","value":"region_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group_name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserSearchQuery, UserSearchQueryVariables>;
export const UsersByOrganizationTotalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersByOrganizationTotal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UsersByOrganizationFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<UsersByOrganizationTotalQuery, UsersByOrganizationTotalQueryVariables>;
export const UserTypesFindManyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserTypesFindMany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterFindManyusertypesInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortFindManyusertypesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserTypesFindMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]} as unknown as DocumentNode<UserTypesFindManyQuery, UserTypesFindManyQueryVariables>;