const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");

const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

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
    return res.json({
      data: gym,
    });
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
      let [newGymId] = await sequelize.query(
        `INSERT INTO gym (gym_name, adress, zipcode, phone, fk_city_id)  
    VALUES 
    ($gym_name, $adress, $zipcode, $phone, $fk_city_id) ;`,
        {
          bind: {
            gym_name: gym_name,
            adress: adress,
            zipcode: zipcode,
            phone: phone,
            fk_city_id: fk_city_id,
          },
          type: QueryTypes.INSERT,
        }
      );
      console.log(newGymId);

      return res
        .setHeader(
          "Location",
          `${req.protocol}://${req.headers.host}/api/v1/gyms/${newGymId}`
        )
        .sendStatus(201);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymById = async (req, res) => {
  const { gym_name, adress, zipcode, phone, fk_city_id } = req.body;
  const gymId = req.params.gymId;
  try {
    if (req.user?.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const [gymToUpdate] = await sequelize.query(
      `UPDATE gym SET gym_name= $gym_name, adress = $adress, zipcode = $zipcode, phone=$phone, fk_city_id=$fk_city_id
      WHERE id = $gymId RETURNING *;`,
      {
        bind: {
          gym_name: gym_name,
          adress: adress,
          zipcode: zipcode,
          phone: phone,
          fk_city_id: fk_city_id,
          gymId: gymId,
        },
      }
    );
    console.log(gymToUpdate[0]);

    return res.status(200).json(gymToUpdate[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteGymById = async (req, res) => {
  const gymId = req.params.gymId;

  try {
    if (req.user?.role !== userRoles.ADMIN) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const [gymExists, userExistsMetaData] = await sequelize.query(
      `SELECT * FROM gym WHERE id = $gymId;`,
      {
        bind: { gymId },
      }
    );

    if (!gymExists || !gymExists[0]) {
      throw new NotFoundError("That gym does not exist");
    } else {
      await sequelize.query(`DELETE FROM review WHERE fk_gym_id = $gymId;`, {
        bind: { gymId },
      });

      await sequelize.query(`DELETE FROM gym WHERE id = $gymId RETURNING *;`, {
        bind: { gymId },
      });

      return res.status(200).json({ message: "gym successfully deleted" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
