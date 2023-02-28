const { sequelize } = require('./config')

const seedGymDb = async () => {
    try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS user;`)
    await sequelize.query(`DROP TABLE IF EXISTS city;`)
    await sequelize.query(`DROP TABLE IF EXISTS gym;`)
    await sequelize.query(`DROP TABLE IF EXISTS review;`)

    // Create user table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        full_name TEXT
        user_alias TEXT
        email TEXT
        password TEXT 
        is_admin boolean
    );
   `)

    // Create city table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        city_name TEXT
    );
    `)

    // Create gym table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS gym (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        gym_name TEXT
        adress TEXT
        zipcode INTEGER
        phone INTEGER
        fk_city_id INTEGER [ref: > city.id]
    );
    `)

    // Create review table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS review (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        title TEXT
        description TEXT
        number_of_stars INTEGER
        fk_gym_id INTEGER [ref: > gym.id]
        fk_user_id INTEGER [ref: > user.id]
    );
    `)

    let userInsertQuery =
      "INSERT INTO user (id, full_name, user_alias, email, password, is_admin) VALUES ('Anna Andersson', 'AdminAnkan','ankanpankan@email.se, 'secret',TRUE),('Bibbi Bibsson', 'Bibban','bibban@email.se, 'secret',FALSE), ('Clarre Clersson', 'Clarre','clarreparre@email.se', 'secret',FALSE), ('Ducky Ducksson', 'Ducky','ducky@email.se, 'secret',FALSE), ('Erik Eriksson', 'Ecke','eckepecke@email.se, 'secret',FALSE);"
    // await sequelize.query(userInsertQuery, {
    //     bind: presidentInsertQueryVariables,
    // })
  
    // const [userRes, metadata] = await sequelize.query('SELECT name, id FROM president')

    let cityInsertQuery =
      `"INSERT INTO city (id, city_name) VALUES 
      ('Stockholm'), 
      ('Göteborg'), 
      ('Malmö');"`
    
      // await sequelize.query(userInsertQuery, {
    //     bind: presidentInsertQueryVariables,
    // })
  
    // const [userRes, metadata] = await sequelize.query('SELECT name, id FROM president')
    
    let gymInsertQuery =
      `"INSERT INTO gym (id, gym_name, adress, zipcode, phone, fk_city_id) VALUES 
      ('Actic Skogås, 'Skogås torget 5', '142 32', '08-0000000'), 
      ('Delta Gym', 'Hälsingegatan 5', '113 23', '08-8888888'), 
      ('Drivkraft','Storgatan 22','171 63', '08-2222222'), 
      ('Hälsokällan', 'Sandhamnsgatan 63A', '115 28', '08-3333333'), 
      ('Endorfin Lerum', 'Gråbovägen 13', '443 60', '03-0111111'), 
      ('Angered Arena','Högaffelsgatan 15', '424 65', '03-0111122'), 
      ('Hela Hälsan', 'Torpagatan 8', '416 74','03-0111133'), 
      ('Bulltofta Motionscenter','Cederströmsgatan 6', '212 39', '04-0666666'), 
      ('SHE', 'Limhamnsgårdens Alle 21', '216 16','04-0666677'), 
      ('Kockum Fritid','Västra Varvsgatan 8', '211 11','04-0666688');"`
    // await sequelize.query(userInsertQuery, {
    //     bind: presidentInsertQueryVariables,
    // })
  
    // const [userRes, metadata] = await sequelize.query('SELECT name, id FROM president')

    let reviewInsertQuery =
    "INSERT INTO review (id, title, description, number_of_stars, fk_gym_id, fk_user_id) VALUES 
    (''), 
    (''), 
    ('');"
  // await sequelize.query(userInsertQuery, {
  //     bind: presidentInsertQueryVariables,
  // })

  // const [userRes, metadata] = await sequelize.query('SELECT name, id FROM president')

  
    console.log('Database successfully populated with data...')
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error)
  } finally {
    // End Node process
    process.exit(0)
  }
}

seedGymDb()


// ('Champ', 'Dog', 'German Shepherd', '2008-11-11', '2021-06-19', 13, (SELECT id FROM president WHERE number = 46 AND name = 'Joe Biden')), 
// ('Major', 'Dog', 'German Shepherd', '2018-01-17', NULL, 5, (SELECT id FROM president WHERE number = 46 AND name = 'Joe Biden'));"
