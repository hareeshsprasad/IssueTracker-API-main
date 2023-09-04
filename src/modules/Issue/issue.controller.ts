import { Issue } from "./issue.model";
import { Op } from "sequelize";
export const issueList = async (req, res) => {
  try {
    let ID = req.query.ID ? req.query.ID : "";
    let status = req.query.status ? req.query.status : "";
    let tracker = req.query.tracker ? req.query.tracker : "";
    const SearchTerm = req.query.SearchTerm ? req.query.SearchTerm : "";
    if (!ID) {
      throw new Error("Please enter the project ID");
    }
    let where = {};
    where[Op.and] = [];
    where[Op.and].push({ ProjectID: ID });
    if (status) {
      where[Op.and].push({ Status: status });
    }
    if (tracker) {
      where[Op.and].push({ Tracker: tracker });
    }
    if (SearchTerm != "") {
      where[Op.and].push([{ Description: { [Op.like]: `%${SearchTerm}%` } }]);
    }
    const issues: any = await Issue.findAll({
      attributes: [
        "ID",
        "Tracker",
        "Description",
        "Status",
        "ProjectID",
        "UpdatedAt",
      ],
      where: where,
    });
    return res.status(200).json({
      success: true,
      message: "Issues listed successfully",
      data: issues,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const save = async (req, res) => {
  try {
    let ID = req.body.ID ? req.body.ID : "";
    let ProjectID = req.body.ProjectID ? req.body.ProjectID : "";
    let Tracker = req.body.Tracker ? req.body.Tracker : "1";
    let Description = req.body.Description ? req.body.Description : "";
    let Status = req.body.Status ? req.body.Status : "1";
    const issue: any = await Issue.findOne({
      attributes: ["ID", "Tracker", "Description"],
      where: {
        Tracker: Tracker,
        Description: Description,
      },
    });
    if (issue) {
      if (!ID || issue.ID != ID) {
        throw new Error("This issue already exists");
      }
    }
    if (!ID) {
      await Issue.create({
        Tracker: Tracker,
        Description: Description,
        Status: Status,
        ProjectID: ProjectID
      });
      return res.status(200).json({
        success: true,
        message: "Project saved successfully",
      });
    } else {
      await Issue.update(
        {
          Tracker: Tracker,
          Description: Description,
          Status: Status,
          ProjectID: ProjectID
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
