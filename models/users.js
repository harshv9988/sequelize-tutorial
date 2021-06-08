module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING,
        // set(value){
        //   this.setdataValue('name',value+ ' Mr')  will set this thiing while inserting
        // }

        // get() {
        //   return this.getDataValue("name") + this.email;
        // },
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: "test@gmail.com",
        allowNull: false,
        unique: true,
      },
      gender: {
        type: DataTypes.STRING,
        validate: {
          // equals: "male",
          // isIn: [["male", "female"]],
          equals: {
            args: "male",
            msg: "Please enter only male",
          },
        },
      },
    },
    {
      //tableName:'the name you want'
      //   timestamps:true
      // updatedAt: false,
      // createdAt: false, //or you can use timestamp false
      // for changing names we can do createdAt:created_at
      // hooks:{
      //   beforeValidate:(user,options)=>{
      //     user.name = 'changedname'
      //   },
      //   afterValidate:(user,options)=>{
      //     user.name = 'againchangedName'
      //   }
      // }
    }
  );

  //secondMethod for hook
  // Users.addHook("beforeValidate", "hookName", (user, options) => {
  //   user.name = "newName";
  // });

  // Users.afterValidate("myHookLast", (user, options) => {
  //   user.name = "againChangesName";
  //   //for removing hook
  //   Users.removeHook("beforeValidate", "hookName");
  // });

  return Users;
};
