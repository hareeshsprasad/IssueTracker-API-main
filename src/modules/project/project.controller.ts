import { Issue } from "../Issue/issue.model";
import { Project } from "./project.model";
import { Op } from "sequelize";
const Config = require("config");

export const save = async (req, res) => {
  try {
    const { ID, Name, Description } = req.body;
    const isAlphaNumeric = /^[a-zA-Z0-9]+$/;
    if (!isAlphaNumeric.test(Name)) {
      throw new Error(
        "Project name should contains only alpha numeric letters"
      );
    }
    const project: any = await Project.findOne({
      attributes: ["ID", "Name", "Description"],
      where: {
        Name: Name,
      },
    });
    if (project) {
      if (!ID || project.ID != ID) {
        throw new Error("This project already exists");
      }
    }
    if (!ID) {
      await Project.create({
        Name: Name,
        Description: Description,
      });
      return res.status(200).json({
        success: true,
        message: "Project saved successfully",
      });
    } else {
      await Project.update(
        {
          Name: Name,
          Description: Description,
        },
        {
          where: {
            ID: ID,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
      });
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const SearchTerm = req.query.SearchTerm ? req.query.SearchTerm : "";
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let row = req.query.row ? parseInt(req.query.row) : 100;
    let offset = (page - 1) * row;
    let count = 0;
    let projectList: any = await Project.findAndCountAll({
      attributes: ["ID", "Name", "Description"],
      where: {
        Name: { [Op.like]: `%${SearchTerm}%` },
      },
      order: [["Name", "ASC"]],
      limit: row,
      offset: offset,
    });
    let projectids = projectList.rows.map((item) => item.ID);
    const issueData: any = await Issue.findAll({
      attributes: ["ID", "ProjectID", "Status", "Tracker"],
      where: { ProjectID: { [Op.in]: projectids } },
    });
    for (let project of projectList.rows) {
      let count = 0;
      let issueStatus;
      for (let issue of issueData) {
        if (issue.ProjectID == project.ID) {
          if (issue.Tracker == "1" && issue.Status == "1") {
            count++;
            issueStatus = true;
          }
        }
      }
      project.dataValues.numberOfOpenIssues = count;
      if (issueStatus) {
        project.dataValues.Status = "Open";
      } else {
        project.dataValues.Status = "Closed";
      }
    }
    return res.status(200).json({
      success: true,
      message: "Project listed successfully",
      data: projectList,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const projectDetails = async (req, res) => {
  try {
    let ID = req.query.ID ? req.query.ID : "";
    if(!ID) {
      throw new Error ("Please enter the project ID")
    }
    const details: any = await Project.findOne({
      attributes: ["ID", "Name", "Description"],
      where: {
        ID: ID,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Project Details Returned successfully",
      data: details,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkStatus = async (req, res) => {
  try {
    let ID = req.query.ID ? req.query.ID : "";
    if(!ID) {
      throw new Error ("Please enter the project ID")
    }
    const issues: any = await Issue.findAll({
      attributes: [
        "ID",
        "Status",
        "ProjectID"
      ],
      where: {
        ProjectID: ID,
      },
    });
    let isActive = issues.map((item) => item.Status);
    if (isActive.includes("1")) {
      throw new Error("Project has active issues, unable to close the project");
    }
    return res.status(200).json({
      success: true,
      message: "Project closed successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
