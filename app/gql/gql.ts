/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Ping {\n    __typename\n  }\n": typeof types.PingDocument,
    "\n  mutation CurriculumsCreateOne($record: CreateOnecurriculumsInput!) {\n    CurriculumsCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n      }\n      error { message }\n    }\n  }\n": typeof types.CurriculumsCreateOneDocument,
    "\n  mutation CurriculumsUpdateOne($_id: String!, $record: UpdateByIdcurriculumsInput!) {\n    CurriculumsUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n        description\n        grade\n        order\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": typeof types.CurriculumsUpdateOneDocument,
    "\n  mutation GroupDeleteOne($_id: String!) {\n    GroupDeleteOne(_id: $_id)\n  }\n": typeof types.GroupDeleteOneDocument,
    "\n  mutation LessonCreateOne($record: CreateOnelessonInput!) {\n    LessonCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": typeof types.LessonCreateOneDocument,
    "\n  mutation LessonUpdateOne($_id: String!, $record: UpdateByIdlessonInput!) {\n    LessonUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": typeof types.LessonUpdateOneDocument,
    "\n  mutation LessonDeleteOne($_id: String!) {\n    LessonDeleteOne(_id: $_id)\n  }\n": typeof types.LessonDeleteOneDocument,
    "\n  query CurriculumsFindMany($filter: curriculumsInput, $limit: Int, $sort: curriculumsSortEnum) {\n    CurriculumsFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n": typeof types.CurriculumsFindManyDocument,
    "\n  query CurriculumsFindOne($filter: curriculumsInput) {\n    CurriculumsFindOne(filter: $filter) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n": typeof types.CurriculumsFindOneDocument,
    "\n  query DistrictFindMany(\n    $filter: FilterFindManydistrictInput\n    $limit: Int\n    $skip: Int\n    $sort: SortFindManydistrictInput\n  ) {\n    DistrictFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {\n      _id\n      name\n      state\n      country\n      platform\n      organization\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.DistrictFindManyDocument,
    "\n  mutation DistrictCreateOne($record: CreateOnedistrictInput!) {\n    DistrictCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": typeof types.DistrictCreateOneDocument,
    "\n  mutation DistrictUpdateOne(\n    $_id: String!\n    $record: UpdateByIddistrictInput!\n  ) {\n    DistrictUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        organization\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": typeof types.DistrictUpdateOneDocument,
    "\n  query GroupFindMany($filter: groupsInput) {\n    GroupFindMany(filter: $filter) {\n      _id\n      name\n      grade\n      manager\n      organization\n      platform\n      curriculums\n      managerObj {\n        _id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": typeof types.GroupFindManyDocument,
    "\n  mutation GroupCreateOne(\n    $name: String!\n    $teacher: String\n    $platform: String\n    $organization: String\n    $curriculums: [String]\n  ) {\n    GroupCreateOne(\n      name: $name\n      teacher: $teacher\n      platform: $platform\n      organization: $organization\n      curriculums: $curriculums\n    ) {\n      _id\n      name\n      manager\n      organization\n      platform\n      curriculums\n    }\n  }\n": typeof types.GroupCreateOneDocument,
    "\n  query LessonFindMany($filter: lessonInput, $limit: Int, $sort: lessonSortEnumTC) {\n    LessonFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      order\n      class\n      curriculum\n      classificationType\n      lifeSkill\n      deleted\n      cover { type url }\n    }\n  }\n": typeof types.LessonFindManyDocument,
    "\n  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {\n    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {\n      _id\n      name\n      district\n      state\n      country\n      platform\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.SchoolFindManyDocument,
    "\n  mutation SchoolCreateOne($record: CreateOneschoolsDataInput!) {\n    SchoolCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": typeof types.SchoolCreateOneDocument,
    "\n  mutation SchoolUpdateOne($_id: String!, $record: UpdateByIdschoolsDataInput!) {\n    SchoolUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": typeof types.SchoolUpdateOneDocument,
    "\n  query UsersFindOne {\n    UsersFindOne {\n      _id\n      firstName\n      lastName\n      email\n      userName\n      type\n      typeObj {\n        identifier\n      }\n      organization\n      profilePicture {\n        url\n      }\n    }\n  }\n": typeof types.UsersFindOneDocument,
};
const documents: Documents = {
    "\n  query Ping {\n    __typename\n  }\n": types.PingDocument,
    "\n  mutation CurriculumsCreateOne($record: CreateOnecurriculumsInput!) {\n    CurriculumsCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n      }\n      error { message }\n    }\n  }\n": types.CurriculumsCreateOneDocument,
    "\n  mutation CurriculumsUpdateOne($_id: String!, $record: UpdateByIdcurriculumsInput!) {\n    CurriculumsUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n        description\n        grade\n        order\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": types.CurriculumsUpdateOneDocument,
    "\n  mutation GroupDeleteOne($_id: String!) {\n    GroupDeleteOne(_id: $_id)\n  }\n": types.GroupDeleteOneDocument,
    "\n  mutation LessonCreateOne($record: CreateOnelessonInput!) {\n    LessonCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": types.LessonCreateOneDocument,
    "\n  mutation LessonUpdateOne($_id: String!, $record: UpdateByIdlessonInput!) {\n    LessonUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n": types.LessonUpdateOneDocument,
    "\n  mutation LessonDeleteOne($_id: String!) {\n    LessonDeleteOne(_id: $_id)\n  }\n": types.LessonDeleteOneDocument,
    "\n  query CurriculumsFindMany($filter: curriculumsInput, $limit: Int, $sort: curriculumsSortEnum) {\n    CurriculumsFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n": types.CurriculumsFindManyDocument,
    "\n  query CurriculumsFindOne($filter: curriculumsInput) {\n    CurriculumsFindOne(filter: $filter) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n": types.CurriculumsFindOneDocument,
    "\n  query DistrictFindMany(\n    $filter: FilterFindManydistrictInput\n    $limit: Int\n    $skip: Int\n    $sort: SortFindManydistrictInput\n  ) {\n    DistrictFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {\n      _id\n      name\n      state\n      country\n      platform\n      organization\n      createdAt\n      updatedAt\n    }\n  }\n": types.DistrictFindManyDocument,
    "\n  mutation DistrictCreateOne($record: CreateOnedistrictInput!) {\n    DistrictCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": types.DistrictCreateOneDocument,
    "\n  mutation DistrictUpdateOne(\n    $_id: String!\n    $record: UpdateByIddistrictInput!\n  ) {\n    DistrictUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        organization\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": types.DistrictUpdateOneDocument,
    "\n  query GroupFindMany($filter: groupsInput) {\n    GroupFindMany(filter: $filter) {\n      _id\n      name\n      grade\n      manager\n      organization\n      platform\n      curriculums\n      managerObj {\n        _id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": types.GroupFindManyDocument,
    "\n  mutation GroupCreateOne(\n    $name: String!\n    $teacher: String\n    $platform: String\n    $organization: String\n    $curriculums: [String]\n  ) {\n    GroupCreateOne(\n      name: $name\n      teacher: $teacher\n      platform: $platform\n      organization: $organization\n      curriculums: $curriculums\n    ) {\n      _id\n      name\n      manager\n      organization\n      platform\n      curriculums\n    }\n  }\n": types.GroupCreateOneDocument,
    "\n  query LessonFindMany($filter: lessonInput, $limit: Int, $sort: lessonSortEnumTC) {\n    LessonFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      order\n      class\n      curriculum\n      classificationType\n      lifeSkill\n      deleted\n      cover { type url }\n    }\n  }\n": types.LessonFindManyDocument,
    "\n  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {\n    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {\n      _id\n      name\n      district\n      state\n      country\n      platform\n      createdAt\n      updatedAt\n    }\n  }\n": types.SchoolFindManyDocument,
    "\n  mutation SchoolCreateOne($record: CreateOneschoolsDataInput!) {\n    SchoolCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": types.SchoolCreateOneDocument,
    "\n  mutation SchoolUpdateOne($_id: String!, $record: UpdateByIdschoolsDataInput!) {\n    SchoolUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n": types.SchoolUpdateOneDocument,
    "\n  query UsersFindOne {\n    UsersFindOne {\n      _id\n      firstName\n      lastName\n      email\n      userName\n      type\n      typeObj {\n        identifier\n      }\n      organization\n      profilePicture {\n        url\n      }\n    }\n  }\n": types.UsersFindOneDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Ping {\n    __typename\n  }\n"): (typeof documents)["\n  query Ping {\n    __typename\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CurriculumsCreateOne($record: CreateOnecurriculumsInput!) {\n    CurriculumsCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n      }\n      error { message }\n    }\n  }\n"): (typeof documents)["\n  mutation CurriculumsCreateOne($record: CreateOnecurriculumsInput!) {\n    CurriculumsCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n      }\n      error { message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CurriculumsUpdateOne($_id: String!, $record: UpdateByIdcurriculumsInput!) {\n    CurriculumsUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n        description\n        grade\n        order\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"): (typeof documents)["\n  mutation CurriculumsUpdateOne($_id: String!, $record: UpdateByIdcurriculumsInput!) {\n    CurriculumsUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        slug\n        active\n        hidden\n        description\n        grade\n        order\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GroupDeleteOne($_id: String!) {\n    GroupDeleteOne(_id: $_id)\n  }\n"): (typeof documents)["\n  mutation GroupDeleteOne($_id: String!) {\n    GroupDeleteOne(_id: $_id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LessonCreateOne($record: CreateOnelessonInput!) {\n    LessonCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"): (typeof documents)["\n  mutation LessonCreateOne($record: CreateOnelessonInput!) {\n    LessonCreateOne(record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LessonUpdateOne($_id: String!, $record: UpdateByIdlessonInput!) {\n    LessonUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"): (typeof documents)["\n  mutation LessonUpdateOne($_id: String!, $record: UpdateByIdlessonInput!) {\n    LessonUpdateOne(_id: $_id, record: $record) {\n      recordId\n      record {\n        _id\n        title\n        description\n        order\n        curriculum\n        classificationType\n        cover { type url }\n      }\n      error { message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LessonDeleteOne($_id: String!) {\n    LessonDeleteOne(_id: $_id)\n  }\n"): (typeof documents)["\n  mutation LessonDeleteOne($_id: String!) {\n    LessonDeleteOne(_id: $_id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurriculumsFindMany($filter: curriculumsInput, $limit: Int, $sort: curriculumsSortEnum) {\n    CurriculumsFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n"): (typeof documents)["\n  query CurriculumsFindMany($filter: curriculumsInput, $limit: Int, $sort: curriculumsSortEnum) {\n    CurriculumsFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurriculumsFindOne($filter: curriculumsInput) {\n    CurriculumsFindOne(filter: $filter) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n"): (typeof documents)["\n  query CurriculumsFindOne($filter: curriculumsInput) {\n    CurriculumsFindOne(filter: $filter) {\n      _id\n      title\n      description\n      slug\n      active\n      hidden\n      grade\n      category\n      order\n      totalLesson\n      cover { type url }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DistrictFindMany(\n    $filter: FilterFindManydistrictInput\n    $limit: Int\n    $skip: Int\n    $sort: SortFindManydistrictInput\n  ) {\n    DistrictFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {\n      _id\n      name\n      state\n      country\n      platform\n      organization\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query DistrictFindMany(\n    $filter: FilterFindManydistrictInput\n    $limit: Int\n    $skip: Int\n    $sort: SortFindManydistrictInput\n  ) {\n    DistrictFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {\n      _id\n      name\n      state\n      country\n      platform\n      organization\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DistrictCreateOne($record: CreateOnedistrictInput!) {\n    DistrictCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"): (typeof documents)["\n  mutation DistrictCreateOne($record: CreateOnedistrictInput!) {\n    DistrictCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DistrictUpdateOne(\n    $_id: String!\n    $record: UpdateByIddistrictInput!\n  ) {\n    DistrictUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        organization\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"): (typeof documents)["\n  mutation DistrictUpdateOne(\n    $_id: String!\n    $record: UpdateByIddistrictInput!\n  ) {\n    DistrictUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        state\n        country\n        platform\n        organization\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GroupFindMany($filter: groupsInput) {\n    GroupFindMany(filter: $filter) {\n      _id\n      name\n      grade\n      manager\n      organization\n      platform\n      curriculums\n      managerObj {\n        _id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GroupFindMany($filter: groupsInput) {\n    GroupFindMany(filter: $filter) {\n      _id\n      name\n      grade\n      manager\n      organization\n      platform\n      curriculums\n      managerObj {\n        _id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GroupCreateOne(\n    $name: String!\n    $teacher: String\n    $platform: String\n    $organization: String\n    $curriculums: [String]\n  ) {\n    GroupCreateOne(\n      name: $name\n      teacher: $teacher\n      platform: $platform\n      organization: $organization\n      curriculums: $curriculums\n    ) {\n      _id\n      name\n      manager\n      organization\n      platform\n      curriculums\n    }\n  }\n"): (typeof documents)["\n  mutation GroupCreateOne(\n    $name: String!\n    $teacher: String\n    $platform: String\n    $organization: String\n    $curriculums: [String]\n  ) {\n    GroupCreateOne(\n      name: $name\n      teacher: $teacher\n      platform: $platform\n      organization: $organization\n      curriculums: $curriculums\n    ) {\n      _id\n      name\n      manager\n      organization\n      platform\n      curriculums\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LessonFindMany($filter: lessonInput, $limit: Int, $sort: lessonSortEnumTC) {\n    LessonFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      order\n      class\n      curriculum\n      classificationType\n      lifeSkill\n      deleted\n      cover { type url }\n    }\n  }\n"): (typeof documents)["\n  query LessonFindMany($filter: lessonInput, $limit: Int, $sort: lessonSortEnumTC) {\n    LessonFindMany(filter: $filter, limit: $limit, sort: $sort) {\n      _id\n      title\n      description\n      order\n      class\n      curriculum\n      classificationType\n      lifeSkill\n      deleted\n      cover { type url }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {\n    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {\n      _id\n      name\n      district\n      state\n      country\n      platform\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {\n    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {\n      _id\n      name\n      district\n      state\n      country\n      platform\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SchoolCreateOne($record: CreateOneschoolsDataInput!) {\n    SchoolCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"): (typeof documents)["\n  mutation SchoolCreateOne($record: CreateOneschoolsDataInput!) {\n    SchoolCreateOne(record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SchoolUpdateOne($_id: String!, $record: UpdateByIdschoolsDataInput!) {\n    SchoolUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"): (typeof documents)["\n  mutation SchoolUpdateOne($_id: String!, $record: UpdateByIdschoolsDataInput!) {\n    SchoolUpdateOne(_id: $_id, record: $record) {\n      error {\n        message\n      }\n      record {\n        _id\n        name\n        district\n        state\n        country\n        platform\n        createdAt\n        updatedAt\n      }\n      recordId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersFindOne {\n    UsersFindOne {\n      _id\n      firstName\n      lastName\n      email\n      userName\n      type\n      typeObj {\n        identifier\n      }\n      organization\n      profilePicture {\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query UsersFindOne {\n    UsersFindOne {\n      _id\n      firstName\n      lastName\n      email\n      userName\n      type\n      typeObj {\n        identifier\n      }\n      organization\n      profilePicture {\n        url\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;