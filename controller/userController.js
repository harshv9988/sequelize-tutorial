const db = require("../models/index");
const Users = db.users;
const Posts = db.posts;
const Tags = db.tags;
const Video = db.video;
const Image = db.image;
const Comment = db.comment;
const Employee = db.employee;
const { Sequelize, Op, QueryTypes } = require("sequelize");
const { users, sequelize } = require("../models/index");
const image = require("../models/image");

module.exports.addUser = async (req, res) => {
  //   const data = await Users.build({ name: "Harsh", email: "harsh@gmail.com" });
  //   await data.save();

  const data = await Users.create({ name: "sagar", email: "sagar@gmail.com" });
  //   console.log(data.dataValues)

  //for deletion
  //data.destroy()

  console.log(data.id);

  let resp = {
    data: data,
  };

  return res.status(200).json(resp);
};

module.exports.crudOperation = async (req, res) => {
  try {
    // const user = await Users.update(
    //   { gender: "M" },
    //   {
    //     where: {
    //       id: 1,
    //     },
    //     returning: true,
    //     plain: true,
    //   }
    // );

    // const user = await Users.destroy({
    //   where: {
    //     id: 5,
    //   },
    // });

    // const user = await Users.destroy({
    //   truncate: true,
    // });

    // const user = await Users.bulkCreate([
    //   { name: "sagar", email: "sagar1@gmail.com" },
    //   { name: "sagar", email: "sagar2@gmail.com" },
    //   { name: "sagar", email: "sagar3@gmail.com" },
    //   { name: "sagar", email: "sagar4@gmail.com" },
    // ]);

    //inserting only specific field irrespective of the input given
    // const data = await Users.create(
    //   { name: "sagar", email: "sagar@gmail.com" },
    //   {
    //     fields: ["email","gender"],
    //   }
    // );

    // const data = await Users.findAll({
    //   attributes: ["email", "name"],
    // });

    //for renaming while fetching

    // const user = await Users.findAll({
    //   attributes: [
    //     "email",
    //     ["email", "emailId"],
    //     "gender",
    //     [Sequelize.fn("Count", Sequelize.col("email")), "emailCount"],
    //   ],
    // });

    //include exclude
    // const user = await Users.findAll({
    //   attributes: {
    //     exclude: ["name"],
    //     include: [
    //       [Sequelize.fn("Concat", "Mr ", Sequelize.col("name")), "fullName"],
    //     ],
    //   },
    // });

    //operator
    // const user = await Users.findAll({
    //   // where: {
    //   //   id: {
    //   //     [Op.eq]: 2,
    //   //   },
    //   // },
    //   // group: ["name"],
    //   order: [["id", "DESC"]],
    //   limit: 2,
    //   offset: 1,
    // });

    // const user = await Users.findOne({});

    // const user = await Users.findAll({});

    //findByPk
    //fidAndCountAll
    //findOrCreate

    // const user = await Users.count({});

    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    const messages = {};
    err.errors.forEach((error) => {
      let message;
      switch (error.validatorKey) {
        case "not_unique":
          message = "Duplicate email";
          break;
        case "isIn":
          message = "out of bounds gender specified";
          break;
        case "equals":
          console.log(error.message); //message set in schema
          message = "equals error";
          break;
      }

      messages[error.path] = message;
      console.log(messages);
    });
  }
};

module.exports.rawQuery = async (req, res) => {
  const users = db.sequelize.query("SELECT * FROM users", {
    type: QueryTypes.SELECT,
    // model:Users,
    // mapToModel:true,
    // raw:true
  });

  // const users = db.sequelize.query("SELECT * FROM users where gender=:gender", {
  //   type: QueryTypes.SELECT,
  //   replacements: { gender: "male" },
  // });

  // const users = db.sequelize.query("SELECT * FROM users where gender=?", {
  //   type: QueryTypes.SELECT,
  //   replacements: ['male'],
  // });

  // const users = db.sequelize.query("SELECT * FROM users where gender IN(:gender)", {
  //   type: QueryTypes.SELECT,
  //   replacements: { gender: ["male","female"] },
  // });

  // const users = db.sequelize.query("SELECT * FROM users where gender=$gender", {
  //   type: QueryTypes.SELECT,
  //   bind: { gender: "male" },
  // });

  return res.status(200).json({
    record: users,
  });
};

module.exports.oneToOne = async (req, res) => {
  let data = await Users.findAll({
    // include: Posts,
    include: [
      {
        model: Posts,
        as: "postDetails", // should also set in index.js of sequelize
        attributes: ["title", ["name", "newname"]],
      },
    ],
  });
  return res.status(200).json({
    record: data,
  });
};

module.exports.belongToOne = async (req, res) => {
  let data = await Posts.findAll({
    // include: Posts,
    include: [
      {
        model: Users,
      },
    ],
  });
  return res.status(200).json({
    record: data,
  });
};

module.exports.manyToMany = async (req, res) => {
  //post to tag
  // let data = await Posts.findAll({
  //   include: [
  //     {
  //       model: Tags,
  //     },
  //   ],
  // });

  //tag to post

  let data = await Tags.findAll({
    include: [
      {
        model: Posts,
      },
    ],
  });

  return res.status(200).json(data);
};

module.exports.scopes = async (req, res) => {
  let data = await Users.scope("checkStatus").findAll({});
  res.status(200).json(data);
};

module.exports.polymorphic = async (req, res) => {
  let data1 = await image.findAll({
    include: [
      {
        model: Comment,
      },
    ],
  });

  let data2 = await Video.findAll({
    include: [
      {
        model: Comment,
      },
    ],
  });

  let data3 = await Comment.findAll({
    include: [Image, Video],
  });

  res.status(200).json(data1);
};

module.exports.polymorphicMany = async (req, res) => {
  //image
  let data1 = await Image.findAll({
    include: [Tags],
  });

  //video

  let data2 = await Video.findAll({
    include: [Tags],
  });

  //tags
  let data3 = await Tags.findAll({
    include: [Video, Image],
  });
};

module.exports.loading = async (req, res) => {
  //lazy loading

  // let data = await Users.findOne({ where: { id: 8 } });
  // let postData = await data.getPosts();
  // let response = {
  //   users: data,
  //   posts: postData,
  // };

  //eager loading
  let data = await Users.findOne({
    include: [
      {
        // required:true for innerjoin and false for outer join
        model: Posts,
      },
    ],
    where: { id: 8 },
  });

  let response = {
    users: data,
  };

  res.status(200).json(response);
};

module.exports.paranoid = async (req, res) => {
  //after you delete and want to get that deleted filed
  let data1 = await Employee.findAll({
    paranoid: false,
  });

  //restore
  let data2 = await Employee.restore({
    where: {
      id: 2,
    },
  });
};

module.exports.transaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const data = await User.create(
      { name: "hhh", email: "h@gmail.com", gender: "male" },
      {
        transaction: t,
      }
    );

    t.commit();
  } catch (err) {
    t.rollback();
  }

  //for fetching
  // const data = await User.findAll({
  //   transaction: t,
  //   lock: true,
  // });
};

const queryInterface = sequelize.getQueryInterface();
module.exports.queryInterfaceData = async (req, res) => {
  queryInterface.createTable("avon", {
    name: DataTypes.STRING,
  });

  queryInterface.addColumn("avon", "email", {
    type: DataTypes.STRING,
  });

  queryInterface.changeColumn("avon", "email", {
    type: DataTypes.STRING,
    defaultValue: "test@gmail.com",
  });

  queryInterface.removeColumn("avon", "email");

  queryInterface.dropTable("avon");
};
