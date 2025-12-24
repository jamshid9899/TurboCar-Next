import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
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
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberComments
      memberViews
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberComments
      memberViews
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberComments
      memberViews
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const LIKE_TARGET_MEMBER = gql`
  mutation LikeTargetMember($memberId: String!) {
    likeTargetMember(memberId: $memberId) {
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
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberComments
      memberViews
      memberRank
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

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      _id
      propertyCondition
      propertyBrand
      propertyType
      propertyFuelType
      propertyStatus
      propertyLocation
      propertyColor
      propertyTransmission
      propertyFeatures
      propertyCylinders
      propertyYear
      propertyTitle
      propertyPrice
      propertyMileage
      propertyViews
      propertyLikes
      propertyComments
      propertyRank
      propertyImages
      propertyDesc
      propertyRentPrice
      propertySeats
      isForSale
      isForRent
      memberId
      rentedUntil
      minimumRentDays
      maximumRentDays
      soldAt
      deletedAt
      constructedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($input: PropertyUpdate!) {
    updateProperty(input: $input) {
      _id
      propertyCondition
      propertyBrand
      propertyType
      propertyFuelType
      propertyStatus
      propertyLocation
      propertyColor
      propertyTransmission
      propertyFeatures
      propertyCylinders
      propertyYear
      propertyTitle
      propertyPrice
      propertyMileage
      propertyViews
      propertyLikes
      propertyComments
      propertyRank
      propertyImages
      propertyDesc
      propertyRentPrice
      propertySeats
      isForSale
      isForRent
      memberId
      rentedUntil
      minimumRentDays
      maximumRentDays
      soldAt
      deletedAt
      constructedAt
      createdAt
      updatedAt
    }
  }
`;

export const LIKE_TARGET_PROPERTY = gql`
  mutation LikeTargetProperty($propertyId: String!) {
    likeTargetProperty(propertyId: $propertyId) {
      _id
      propertyCondition
      propertyBrand
      propertyType
      propertyFuelType
      propertyStatus
      propertyLocation
      propertyColor
      propertyTransmission
      propertyFeatures
      propertyCylinders
      propertyYear
      propertyTitle
      propertyPrice
      propertyMileage
      propertyViews
      propertyLikes
      propertyComments
      propertyRank
      propertyImages
      propertyDesc
      propertyRentPrice
      propertySeats
      isForSale
      isForRent
      memberId
      rentedUntil
      minimumRentDays
      maximumRentDays
      soldAt
      deletedAt
      constructedAt
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
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
    }
  }
`;

export const UPDATE_BOARD_ARTICLE = gql`
  mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
    updateBoardArticle(input: $input) {
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
    }
  }
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetBoardArticle($articleId: String!) {
    likeTargetBoardArticle(articleId: $articleId) {
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
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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

/**************************
 *         FOLLOW         *
 *************************/

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *   RENTAL BOOKINGS      *
 *************************/

export const CREATE_RENTAL_BOOKING = gql`
  mutation CreateRentalBooking($input: RentalBookingInput!) {
    createRentalBooking(input: $input) {
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
      renterData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
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

export const CONFIRM_RENTAL = gql`
  mutation ConfirmRental($rentalId: String!) {
    confirmRental(rentalId: $rentalId) {
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
      renterData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
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

export const CANCEL_RENTAL = gql`
  mutation CancelRental($rentalId: String!) {
    cancelRental(rentalId: $rentalId) {
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
      renterData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
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

export const FINISH_RENTAL = gql`
  mutation FinishRental($rentalId: String!) {
    finishRental(rentalId: $rentalId) {
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
      renterData {
        _id
        memberNick
        memberFullName
        memberImage
        memberPhone
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

/**************************
 *          VIEW          *
 *************************/

export const CREATE_VIEW = gql`
  mutation CreateView($input: ViewInput!) {
    createView(input: $input) {
      _id
      viewGroup
      viewRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *      FILE UPLOAD       *
 *************************/

export const IMAGE_UPLOADER = gql`
  mutation ImageUploader($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`;

export const IMAGES_UPLOADER = gql`
  mutation ImagesUploader($files: [Upload!]!, $target: String!) {
    imagesUploader(files: $files, target: $target)
  }
`;

/**************************
 *      NEWSLETTER        *
 *************************/

export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsletter($input: String!) {
    subscribeNewsletter(input: $input) {
      _id
      email
      status
      createdAt
      updatedAt
    }
  }
`;