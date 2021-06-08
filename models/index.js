const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("harsh", "root", "harshv", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  pool: { max: 5, min: 0, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });

let db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = require("./users")(sequelize, DataTypes);
db.posts = require("./posts")(sequelize, DataTypes);
db.tags = require("./tags")(sequelize, DataTypes);
db.post_tag = require("./post_tag")(sequelize, DataTypes);
db.employee = require("./employee")(sequelize, DataTypes);

//making scopes
db.users.addScope("checkStatus", {
  where: {
    email: "sagar10@gmail.com",
  },
});

//join scope
db.users.addScope("includePost", {
  include: {
    model: db.posts,
  },
});

// can also add scopes here
// db.posts.belongsTo(db.users.scope('checkStatus'), { foreignKey: "user_id" });

//relations onetoone and onetomany
// db.users.hasOne(db.posts, { foreignKey: "user_id", as: "postDetails" });
db.users.hasMany(db.posts, { foreignKey: "user_id", as: "postDetails" }); //changing name should also set in contrller
db.posts.belongsTo(db.users, { foreignKey: "user_id" });

//user_id is set to foreig key as otherwise it will look for userId as foreign key
//or you can do underscored:true in the schema if you want stating foreign key here

//may to many
db.posts.belongsToMany(db.tags, { through: "post_tag" });
db.tags.belongsToMany(db.posts, { through: "post_tag" });

//-----------------polymorphic
//one to many
db.image = require("./image")(sequelize, DataTypes);
db.video = require("./video")(sequelize, DataTypes);
db.comment = require("./comment")(sequelize, DataTypes);

db.image.hasMany(db.comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentableType: "image",
  },
});

db.video.hasMany(db.comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentableType: "video",
  },
});

db.comment.belongsTo(db.image, {
  foreignKey: "commentableId",
  constraints: false,
});
db.comment.belongsTo(db.video, {
  foreignKey: "commentableId",
  constraints: false,
});

//---------------polymorphic many to many
db.tag_taggable = require("./tag_taggable")(sequelize, DataTypes);

//img to tag
db.image.belongsToMany(db.tags, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "image",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});

// tag to image
db.tags.belongsToMany(db.image, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "image",
    },
  },
  foreignKey: "tagId",
  constraints: false,
});

//video to tag

db.video.belongsToMany(db.tags, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "video",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});

//tag to video

db.tags.belongsToMany(db.video, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "image",
    },
  },
  foreignKey: "tagId",
  constraints: false,
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Table re-synced");
});

module.exports = db;
