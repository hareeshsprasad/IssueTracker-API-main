import { User, decodeJWT } from "./user.model";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
const moment = require('moment');
const Config = require("config");

// login API starts //

export const login = async (req, res) => {
  try {
    req.body.Username = req.body.Username ? req.body.Username : "";
    req.body.Password = req.body.Password ? req.body.Password : "";
    const user: any = await User.findOne({
      attributes: ["ID", "Username","Password"],
      where: {
        Username: req.body.Username,
      },
    });
    if (!user) {
      throw new Error("We are unaware of this user");
    }
    if ((await user.validatePassword(req.body.Password.toString())) !== true) {
      throw new Error("Incorrect Login Credentials");
    }
    return res.status(200).json({
      message: "Welcome back" + " " + user.Username,
      token: user.generateJWTToken(),
      data: {
        ID: user.ID,
        Username: user.Username
      },
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// Login API ends //

//  Save API starts //

export const save = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    if (!req.body.Email) {
      throw new Error("Invalid Request. Please make sure email is provided");
    }
    req.body.Email = req.body.Email.toLowerCase();
    req.body.Name = req.body.Name ? req.body.Name : "";
    req.body.Email = req.body.Email ? req.body.Email : "";
    req.body.Password = req.body.Password ? req.body.Password : "";
    req.body.Role = req.body.Role ? req.body.Role : "";
    let existingEmails: any = [];
    let ID = req.body.ID ? req.body.ID : null;
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(req.body.Email))
      throw new Error("Please provide a valid Email");

    existingEmails = await User.findOne({
      attributes: ["ID", "Email"],
      where: {
        Email: req.body.Email,
      },
    });
    if (existingEmails) {
      if (existingEmails.dataValues.ID != req.body.ID) {
        throw new Error(`Email  Already Exists`);
      }
    }
    if (req.body.Password != null) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.Password, salt);
      req.body.Password = hash;
    }
    if (payload.Role == "Basic") {
      throw new Error("Basic user has no permssion to create other users");
    }
    if (
      (payload.Role == "Admin" && req.body.Role == "Admin") ||
      req.body.Role == "SuperAdmin"
    ) {
      throw new Error(
        "Admin user has no permssion to create other Admin users or Super Admin"
      );
    }
    const user = await User.findOne({
      attributes: ["ID", "Email"],
      where: {
        ID: ID,
      },
    });
    if (!user) {
      await User.create(req.body);
      return res.status(200).json({
        message: "User Saved Successfully",
        success: true,
      });
    } else {
      await User.upsert(req.body);
      return res.status(200).json({
        message: "User Saved Successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: error.message,
      success: false,
    });
  }
};
// Save API ends //

// Delete API starts //
export const deleteUser = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    let ID = req.query.ID ? req.query.ID : null;
    if (!ID) {
      throw new Error("Please Provide the UserID");
    }
    const user = await User.findOne({
      where: {
        ID: ID,
      },
    });
    if (payload.Role == "Basic") {
      throw new Error("Basic user has no permssion to delete other users");
    }
    if (
      payload.Role == "Admin" &&
      (user.dataValues.Role == "SuperAdmin" || user.dataValues.Role == "Admin")
    ) {
      throw new Error(
        "Admin user has no permission to delete other Admin users or Super Admin"
      );
    }
    if (!user) {
      throw new Error("User Not Found");
    } else {
      await User.destroy({
        where: {
          ID: ID,
        },
      });
    }
    return res.status(200).json({
      message: "User Deleted Successfully",
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// Log List API Starts //

export const logList = async (req, res) => {
  try {
    const payload:any = decodeJWT(req.headers.authorization);
    if(payload.Role == "Admin" || payload.Role == "Basic") {
      throw new Error('You are not authorized to access this route.');
    }
    const logFilePath = path.join(__dirname, '../../../logs/api.log');
    const logData = await fs.promises.readFile(logFilePath, 'utf8');
    const logs = logData
      .trim()
      .split('\n')
      .map((logEntry) => JSON.parse(logEntry));

    const currentTime = moment();
    const fiveMinutesAgo = moment().subtract(5, 'minutes');

    const filteredLogs = logs.filter((log) => {
      const logTimestamp = moment(log.message, 'h:mm:ss A');
      return logTimestamp.isBetween(fiveMinutesAgo, currentTime, null, '[]');
    });

    return res.status(200).json({
      message: 'Log Listed Successfully',
      data: filteredLogs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Log List API Ends //


export const list =async (req,res) => {
  try {
    const { Op } = require("sequelize");
    const moment = require('moment');
    const targetDate = moment("2023-07-31 17:21:11");
    console.log(targetDate);
    const users = await User.findAll({
      where: {
        createdAt: {
          [Op.eq]: targetDate,
        },
      },
    });
    console.log("users:", users);
    res.status(200).json({
      data:users
    })
  } catch (error) {
    res.status(200).json({
     message:error
    })
  }
 
}