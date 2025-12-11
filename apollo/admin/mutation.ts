import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberProperties
      memberRank
      memberArticles
      memberPoints
      memberLikes
      memberViews
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_PROPERTY_BY_ADMIN = gql`
  mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
    updatePropertyByAdmin(input: $input) {
      _id
      propertyCondition
      propertyType
      propertyStatus
      propertyBrand
      propertyLocation
      propertyAddress
      propertyTitle
      propertyPrice
      propertyYear
      propertyMileage
      propertyFuelType
      propertyTransmission
      propertyColor
      propertySeats
      propertyCylinders
      propertyImages
      propertyDesc
      propertyRent
      propertyRentPrice
      propertyFeatures
      propertyViews
      propertyLikes
      propertyRank
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
  mutation RemovePropertyByAdmin($input: String!) {
    removePropertyByAdmin(propertyId: $input) {
      _id
      propertyCondition
      propertyType
      propertyStatus
      propertyBrand
      propertyLocation
      propertyAddress
      propertyTitle
      propertyPrice
      propertyYear
      propertyMileage
      propertyFuelType
      propertyTransmission
      propertyColor
      propertySeats
      propertyCylinders
      propertyImages
      propertyDesc
      propertyRent
      propertyRentPrice
      propertyFeatures
      propertyViews
      propertyLikes
      propertyRank
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *   RENTAL BOOKINGS      *
 *************************/

export const UPDATE_RENTAL_BY_ADMIN = gql`
  mutation UpdateRentalByAdmin($input: RentalUpdate!) {
    updateRentalByAdmin(input: $input) {
      _id
      propertyId
      renterId
      ownerId
      rentalType
      rentalStatus
      startDate
      endDate
      totalPrice
      createdAt
      updatedAt
      propertyData {
        _id
        propertyTitle
        propertyPrice
        propertyImages
        propertyLocation
      }
      renterData {
        _id
        memberNick
        memberFullName
        memberPhone
      }
      ownerData {
        _id
        memberNick
        memberFullName
        memberPhone
      }
    }
  }
`;

export const REMOVE_RENTAL_BY_ADMIN = gql`
  mutation RemoveRentalByAdmin($rentalId: String!) {
    removeRentalByAdmin(rentalId: $rentalId) {
      _id
      propertyId
      renterId
      ownerId
      rentalType
      rentalStatus
      startDate
      endDate
      totalPrice
      createdAt
      updatedAt
      propertyData {
        _id
        propertyTitle
        propertyPrice
        propertyImages
        propertyLocation
      }
      renterData {
        _id
        memberNick
        memberFullName
        memberPhone
      }
      ownerData {
        _id
        memberNick
        memberFullName
        memberPhone
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;