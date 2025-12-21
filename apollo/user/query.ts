import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
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
      memberArticles
      memberPoints
      memberLikes
      memberViews
      memberFollowings
      memberFollowers
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
      meFollowed {
        followingId
        followerId
        myFollowing
      }
    }
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
  query GetProperty($input: String!) {
    getProperty(propertyId: $input) {
      _id
      propertyCondition
      propertyType
      propertyStatus
      propertyBrand
      propertyLocation
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
      propertyRentPrice
      isForSale
      isForRent
      propertyFeatures
      propertyViews
      propertyLikes
      propertyComments
      propertyRank
      memberId
      rentedUntil
      minimumRentDays
      maximumRentDays
      soldAt
      deletedAt
      constructedAt
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_PROPERTIES = gql`
  query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        _id
        propertyCondition
        propertyType
        propertyStatus
        propertyBrand
        propertyLocation
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
        propertyRentPrice
        isForSale
        isForRent
        propertyFeatures
        propertyViews
        propertyLikes
        propertyComments
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
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      totalCount
    }
  }
`;

export const GET_AGENT_PROPERTIES = gql`
  query GetAgentProperties($input: AgentPropertiesInquiry!) {
    getAgentProperties(input: $input) {
      list {
        _id
        propertyCondition
        propertyType
        propertyStatus
        propertyBrand
        propertyLocation
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
        propertyRentPrice
        isForSale
        isForRent
        propertyFeatures
        propertyViews
        propertyLikes
        propertyComments
        propertyRank
        memberId
        soldAt
        deletedAt
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
      list {
        _id
        propertyCondition
        propertyType
        propertyStatus
        propertyBrand
        propertyLocation
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
        propertyRentPrice
        isForSale
        isForRent
        propertyFeatures
        propertyViews
        propertyLikes
        propertyComments
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
          memberProperties
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      totalCount
    }
  }
`;

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
      list {
        _id
        propertyCondition
        propertyType
        propertyStatus
        propertyBrand
        propertyLocation
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
        propertyRentPrice
        isForSale
        isForRent
        propertyFeatures
        propertyViews
        propertyLikes
        propertyComments
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
          memberProperties
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      totalCount
    }
  }
`;

/**************************
 *   RENTAL BOOKINGS      *
 *************************/

export const GET_MY_RENTALS = gql`
  query GetMyRentals {
    getMyRentals {
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
        propertyMileage
        propertyImages
        propertyRentPrice
        isForSale
        isForRent
      }
      ownerData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
      }
    }
  }
`;

export const GET_OWNER_RENTALS = gql`
  query GetOwnerRentals {
    getOwnerRentals {
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
        isForSale
        isForRent
      }
      renterData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
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
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
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
 *         FOLLOW         *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        followerData {
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
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followingData {
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
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;