const { UnauthenticatedError, NotFoundError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");
const { CustomAPIError, BadRequestError } = require("../utils/errors");

exports.getAllGyms = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);
    const city = req.query.city;

    console.log(limit);

    if (!city) {
      const [gyms, metadata] = await sequelize.query(
        `SELECT * FROM gym ORDER by gym_name ASC, fk_city_id ASC LIMIT $limit OFFSET $offset;`,
        {
          bind: {
            limit: limit,
            offset: offset,
          },
        }
      );
      if (!gyms || !gyms[0]) {
        throw new NotFoundError("sorry we can't find any gyms");
      }
      return res.json({
        data: gyms,
        metadata: {
          limit: limit,
          offset: offset,
        },
      });
    } else {
      const [gyms, metadata] = await sequelize.query(
        `SELECT * FROM gym WHERE fk_city_id = (SELECT id FROM city WHERE UPPER(city_name)= UPPER(TRIM($cityName))) ORDER BY gym_name ASC LIMIT $limit OFFSET $offset;`,
        {
          bind: {
            cityName: city,
            limit: limit,
            offset: offset,
          },
        }
      );
      if (!gyms || !gyms[0]) {
        throw new NotFoundError(" sorry we have no gyms listed in that city");
      }
      return res.json({
        data: gyms,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymById = async (req, res) => {
  const gymId = req.params.gymId || req.body.gymId;

  try {
    const [gym, metadata] = await sequelize.query(
      `SELECT * FROM gym WHERE id = $gymId`,
      {
        bind: {
          gymId: gymId,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createGym = async (req, res) => {
  const { gym_name, adress, zipcode, phone, fk_city_id } = req.body;

  try {
    if (req.user?.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    const [gymAllReadyInDatabase] = await sequelize.query(
      `SELECT gym_name FROM gym WHERE gym_name = $gym_name AND zipcode = $zipcode;`,
      {
        bind: {
          gym_name: gym_name,
          zipcode: zipcode,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (gymAllReadyInDatabase) {
      throw new BadRequestError("That gym already exists");
    } else {
      await sequelize.query(
        `INSERT INTO gym (gym_name, adress, zipcode, phone, fk_city_id)  
    VALUES 
    ($gym_name, $adress, $zipcode, $phone, $fk_city_id);`,
        {
          bind: {
            gym_name: gym_name,
            adress: adress,
            zipcode: zipcode,
            phone: phone,
            fk_city_id: fk_city_id,
          },
        }
      );

      return res.status(201).json({ message: "gym successfully created" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymById = async (req, res) => {
  try {
    return res.send("updateGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteGymById = async (req, res) => {
  try {
    return res.send("deleteGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
