const Sequelize = require('sequelize');

const sequelize = new Sequelize('potlucky', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


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
  },
  id_friend: {
    type: Sequelize.INTEGER,
  },
});


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

module.exports = {
  User,
  UserFriends,
  Event,
  Message,
};
