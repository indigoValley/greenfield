const Sequelize = require('sequelize');
const passwordHash = require('password-hash');

const sequelize = new Sequelize('potlucky', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// const sequelize = new Sequelize('dinner', 'buckeyedseminole', 'Opspark17', {
//   host: 'whoscomingtodinner.database.windows.net',
//   dialect: 'mssql',
//   dialectOptions: {
//     encrypt: true,
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });

sequelize.authenticate()
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

const User = sequelize.define('user', {
  Name: {
    type: Sequelize.STRING,
  },
  Host_Rating: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  Contributor_Rating: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  Email: {
    type: Sequelize.STRING,
  },
  City: {
    type: Sequelize.STRING,
  },
  Password: {
    type: Sequelize.STRING,
  },
  Notifications: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
  Birthday: {
    // format: YYYY-MM-DD
    type: Sequelize.STRING,
  },
  Image: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
});

const UserFriends = sequelize.define('user_friends', {
  id_user: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'User',
    //   key: 'id',
    // },
  },
  id_friend: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'User',
    //   key: 'id',
    // },
  },
});

// set up friendship associations
// User.belongsToMany(User, {
//   as: 'Friend',
//   through: UserFriends,
//   // foreignKey: 'id_user',
//   // otherKey: 'id_friend',
// });
// User.belongsToMany(User, {
//   as: 'User',
//   through: UserFriends,
//   foreignKey: 'id_friend',
//   otherKey: 'id_user',
// });
// give up on setting associations correctly

const Event = sequelize.define('event', {
  Name: {
    type: Sequelize.STRING,
  },
  RecipeID: {
    type: Sequelize.STRING,
  },
  LocationLat: {
    type: Sequelize.DECIMAL(18, 7),
  },
  LocationLng: {
    type: Sequelize.DECIMAL(18, 7),
  },
  Address: {
    type: Sequelize.STRING,
  },
  Date: {
    // format: YYYY-MM-DD
    type: Sequelize.STRING,
  },
  Time: {
    // Military time
    type: Sequelize.STRING,
  },
  Host: {
    type: Sequelize.STRING,
  },
  Contributor_List: {
    type: Sequelize.STRING,
  },
  City: {
    type: Sequelize.STRING,
  },
  Zip_Code: {
    type: Sequelize.INTEGER,
  },
});


const Message = sequelize.define('message', {
  Handle: {
    type: Sequelize.STRING,
  },
  Message: {
    type: Sequelize.STRING,
  },
  Event: {
    type: Sequelize.STRING,
  },
});

User.sync();
UserFriends.sync();
Event.sync();
Message.sync();

// TEST USER ADD & GET FRIENDS
// User.sync().then(() => {
//   return User.create({
//     Name: 'fred',
//     Email: 'fred@flintstone.com',
//     City: 'bedrock',
//     Password: 'pass',
//     Birthday: 'some day',
//   });
// })
//   .then((fred) => {
//     console.log('create fred', fred.dataValues);
//     return User.create({
//       Name: 'barney',
//       Email: 'barney@rubble.com',
//       City: 'bedrock',
//       Password: 'pass2',
//       Birthday: 'some other day',
//     });
//   })
//   .then((barney) => {
//     console.log('create barney', barney.dataValues);
//     return UserFriends.sync();
//   })
//   .then(() => {
//     User.findOne({
//       where: { 
//         Name: 'fred',
//       },
//     })
//       .then((fred) => {
//         User.findOne({
//           where: {
//             Name: 'barney',
//           },
//         })
//           .then((barney) => {
//             UserFriends.sync().then(() => {
//               return UserFriends.create({
//                 id_user: fred.dataValues.id,
//                 id_friend: barney.dataValues.id,
//               })
//                 .then(() => {
//                   UserFriends.findAll({
//                     where: {
//                       id_user: fred.dataValues.id,
//                     },
//                     attributes: ['id_friend'],
//                   })
//                     .then((friends) => {
//                       friends.forEach((friend) => {
//                         // console.log('friend', friend.dataValues);
//                         User.findById(friend.dataValues.id_friend)
//                           .then((user) => {
//                             console.log('friend', user.dataValues);
//                           });
//                       });
//                     });
//                 });
//             });
//           });
//       });
//   })
//   .catch((err) => {
//     console.log('error testing db', err);
//   });


  /**
   * Executing (default): CREATE TABLE IF NOT EXISTS `user_friends` (`createdAt` DATETIME NOT NULL, `up
datedAt` DATETIME NOT NULL, `id_friend` INTEGER , `user` INTEGER , PRIMARY KEY (`id_friend`, `user
`), FOREIGN KEY (`id_friend`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREI
GN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB
   */

// TEST DB-MESSAGE CREATION & QUERY
// Message.sync().then(() => {
  //   Message.findOrCreate({
    //     where: { Handle: 'randomUser' },
    //     defaults: {
      //       Message: 'I am a test message',
      //       Event: 'jam sesh',
      //     },
      //   }).spread((message, created) => {
        //     console.log(message.get({ plain: true }));
        //     console.log(created);
        //   });
        // });
        
        // TEST DB-EVENT CREATION & QUERY
        // Event.sync({ force: true }).then(() => {
//   Event.findOrCreate({
//     where: { Name: 'test event 1' },
//     // defaults: {
//     //   RecipeID: 'http://www.edamam.com/ontologies/edamam.owl%23recipe_23086a94b64c2ba96e12b0dde8b23eb4',
//     //   Address: '748 Camp St',
//     //   LocationLat: 29.945947,
//     //   LocationLng: -90.0700232,
//     //   Time: Date.now(),
//     //   Host: 'jp',
//     // },
//     defaults: {
//       RecipeID: 'recipe_23086a94b64c2ba96e12b0dde8b23eb4',
//       Address: '729 Louque Pl',
//       City: 'New Orleans',
//       Zip_Code: 70124,
//       Contributor_List: '',
//       LocationLat:
//     29.9891516,
//       LocationLng: -90.1087028,
//       Date: '2017-11-5',
//       Time: '14:00',
//       Host: 'jp',
//     },
//   }).spread((event, created) => {
//     console.log(event.get({ plain: true }));
//     console.log(created);
//   });
// });

// // TEST DB-USER CREATION & QUERY
// User.sync({ force: true }).then(() => {
//   const hash = passwordHash.generate('test');
//   // TEST password-hash
//   User.findOrCreate({
//     where: { Email: 'jake@test.com' }, 
//     defaults: {
//       Name: 'Jake Test',
//       Host_Rating: 0,
//       Contributor_Rating: 0,
//       Notifications: '',
//       Email: 'jake@jake.com',
//       City: 'New Orleans',
//       Password: hash,
//       Birthday: '1993-07-21',
//       Image: '',
//     },
//   })
//     .spread((user, created) => {
//       console.log(user.get({ plain: true }));
//       console.log(created);
//     });
// });


module.exports.User = User;
module.exports.UserFriends = UserFriends;
module.exports.Event = Event;
module.exports.Message = Message;
