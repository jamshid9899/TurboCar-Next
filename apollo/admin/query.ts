import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
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
        memberWarnings
        memberBlocks
        memberProperties
        memberRank
        memberArticles
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_ALL_PROPERTIES_BY_ADMIN = gql`
  query GetAllPropertiesByAdmin($input: AllPropertiesInquiry!) {
    getAllPropertiesByAdmin(input: $input) {
      list {
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
        memberData {
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
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *   RENTAL BOOKINGS      *
 *************************/

// 🔴 ESKI QUERY O'CHIRILDI - Duplicate bo'lgani uchun
// Yangi query line 257'da (startDate, endDate, totalPrice, renterId, ownerId)

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
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
        memberData {
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
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_ALL_COMMENTS_BY_ADMIN = gql`
  query GetAllCommentsByAdmin($input: CommentsInquiry!) {
    getAllCommentsByAdmin(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
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
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *   RENTAL BOOKINGS      *
 *************************/

export const GET_ALL_RENTALS_BY_ADMIN = gql`
  query GetAllRentalsByAdmin($input: RentalInquiry!) {
    getAllRentalsByAdmin(input: $input) {
      list {
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
          propertyCondition
          propertyBrand
          propertyType
          propertyStatus
          propertyLocation
          propertyTitle
          propertyPrice
          propertyYear
          propertyImages
        }
        renterData {
          _id
          memberType
          memberNick
          memberFullName
          memberImage
          memberPhone
        }
        ownerData {
          _id
          memberType
          memberNick
          memberFullName
          memberImage
          memberPhone
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *      STATISTICS        *
 *************************/

export const GET_STATISTICS_BY_ADMIN = gql`
  query GetStatisticsByAdmin {
    getStatisticsByAdmin {
      totalMembers
      totalProperties
      totalRentals
      totalArticles
      activeProperties
      soldProperties
      rentedProperties
      pendingRentals
      confirmedRentals
      recentMembers
      recentProperties
    }
  }
`;