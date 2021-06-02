var express = require('express');
var userRoute = require('./user/user.routes');
var adminRoute = require('./admin/admin.routes');
var router = express.Router();

router.use('/user', userRoute);
router.use('/admin', adminRoute);
router.use('/help', (req, res) => {
    res.json([
        {
            Model: "User",
            Schema: {
                uid: "String: user id by firebase",
                name: "String: name of user",
                email: "String: email of user",
                companyName: "String: company name of user",
                businessNumber: "String: business number of user",
                phoneNumber: "String: phone number of user",
                carrierDocuments: "Array-String: image urls of user documents",
                favTruckUserIds: "Array-String: uid of other users",
                hasOwnTruck: "Boolean: determine the user is trucker or load poster",
                loadLimit: "Number: load posting limit for load poster",
                address: {
                    address: "String: street address of user",
                    city: "String: city name of user",
                    country: "String: country name of user"
                },
                fcmToken: "String: firebase device registration token",
                truck: {
                    truckType: "String: type of truck",
                    skidCapacity: "String: no of skids capacity of truck",
                    drivingExperience: "String: total driving experience of truck user",
                    isInsured: "Boolean: determine that truck is insured or not",
                    travelPreference: "String: area of truck service coverage",
                    loadLimit: "Number: load booking limit of truck user",
                    favLoadIds: "Array-String: ids of loads"
                },
                createdAt: "firebase_timestamp: time at which user is created"
            }
        },
        {
            Model: "Load",
            Schema: {
                userId: "String: uid of user who posted this load",
                truckUserId: "String: uid of truck user who books this load",
                loadItemName: "String: name of load",
                skidCount: "String: skids count of this load",
                weight: "String: weight of load",
                pickupAddress: {
                    address: "String: street address of load pickup location",
                    city: "String: city name of load to pick",
                    country: "String: country name of load to pick"
                },
                dropOffAddress: {
                    address: "String: street address of load drop location",
                    city: "String: city name of load to drop",
                    country: "String: country name of load to drop"
                },
                dateTime: "String: date/time ISO format string",
                priceRange: "String: price range of load by load poster",
                statusShipping: "Number: 1:NEW, 2:BOOKED, 3:DESTINATION, 4:DELIVERED, 5:COMPLETED",
                rating: {
                    truckerRating: "Number: rating for truck by load poster",
                    userRating: "Number: rating for user by truck loader"
                },
                createdAt: "firebase_timestamp: time at which load is created"
            }
        },
        {
            Model: "FreePlan",
            Schema: {
                name: "String: general name of free plan",
                description: "String: description of this plan",
                userLoadLimit: "Number: limit of load posting for poster",
                truckerLoadLimi: "Number: limit of load booking for trucker"
            }
        },
        {
            Model: "Package",
            Schema: {
                name: "String: general name of free plan",
                description: "String: description of this plan",
                amount: "Number: price of this premium package",
                validPeriodMonths: "Number: number of months for this premium package"
            }
        },
        {
            Model: "Query",
            Schema: {
                userId: "String: uid of user who posted this query",
                title: "String: title of query discussion",
                query: "String: actual query question of user",
                queryReply: "String: query answer by support team",
                status: "Number: 1:PENDING, 2:RESOLVED",
                createdAt: "firebase_timestamp: time at which query is created"
            }
        }
    ]);
});

module.exports = router;
