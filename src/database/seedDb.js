const { sequelize } = require("./config");
const bcrypt = require("bcrypt");

const seedGymDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS gym;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

    // Create user table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        user_alias TEXT,
        email TEXT,
        password TEXT ,
        is_admin boolean
    );
   `);

    // Create city table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT
    );
    `);

    // Create gym table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS gym (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gym_name TEXT,
        adress TEXT,
        zipcode TEXT,
        phone TEXT,
        fk_city_id INTEGER,
        FOREIGN KEY (fk_city_id) REFERENCES city(id)
    );
    `);

    // Create review table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS review (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        number_of_stars INTEGER,
        fk_gym_id INTEGER,
        fk_user_id INTEGER,
        FOREIGN KEY (fk_gym_id) REFERENCES gym(id),
        FOREIGN KEY (fk_user_id) REFERENCES user(id)
    );
    `);

    const password = "secret";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const hashedPassword2 = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const hashedPassword3 = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const hashedPassword4 = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    let userInsertQuery = `INSERT INTO user (full_name, user_alias, email, password, is_admin) VALUES 
      ('Anna Andersson', 'AdminAnkan','ankanpankan@email.se', '${hashedPassword1}', TRUE),
      ('Bibbi Bibsson', 'Bibban','bibban@email.se', '${hashedPassword2}',FALSE), 
      ('Clarre Clersson', 'Clarre','clarreparre@email.se', '${hashedPassword3}',FALSE), 
      ('Ducky Ducksson', 'Ducky','ducky@email.se', '${hashedPassword4}',FALSE);`;

    await sequelize.query(userInsertQuery);

    let cityInsertQuery = `INSERT INTO city (city_name) VALUES 
      ('Stockholm'), 
      ('Göteborg'), 
      ('Malmö');`;

    await sequelize.query(cityInsertQuery);

    let gymInsertQuery = `INSERT INTO gym (gym_name, adress, zipcode, phone, fk_city_id) VALUES 
    ('Actic Skogås', 'Skogås torget 5', '142 32', '08-0000000',(SELECT id FROM city WHERE city_name = 'Stockholm')), 
    ('Delta Gym', 'Hälsingegatan 5', '113 23', '08-8888888', (SELECT id FROM city WHERE city_name = 'Stockholm')), 
    ('Drivkraft','Storgatan 22','171 63', '08-2222222', (SELECT id FROM city WHERE city_name = 'Stockholm')), 
    ('Hälsokällan', 'Sandhamnsgatan 63A', '115 28', '08-3333333', (SELECT id FROM city WHERE city_name = 'Stockholm')), 
    ('Endorfin Lerum', 'Gråbovägen 13', '443 60', '03-0111111', (SELECT id FROM city WHERE city_name = 'Göteborg')), 
    ('Angered Arena','Högaffelsgatan 15', '424 65', '03-0111122', (SELECT id FROM city WHERE city_name = 'Göteborg')), 
    ('Hela Hälsan', 'Torpagatan 8', '416 74','03-0111133', (SELECT id FROM city WHERE city_name = 'Göteborg')), 
    ('Bulltofta Motionscenter','Cederströmsgatan 6', '212 39', '04-0666666', (SELECT id FROM city WHERE city_name = 'Malmö')), 
    ('SHE', 'Limhamnsgårdens Alle 21', '216 16','04-0666677', (SELECT id FROM city WHERE city_name = 'Malmö')), 
    ('Kockum Fritid','Västra Varvsgatan 8', '211 11','04-0666688', (SELECT id FROM city WHERE city_name = 'Malmö'));`;

    await sequelize.query(gymInsertQuery);

    let reviewInsertQuery = `INSERT INTO review (title, description, number_of_stars, fk_gym_id, fk_user_id) 
    VALUES 
       ('Great!', 'Lots of space, very clean machines, large area for free weights, and friendly staff! I will be back!', 5, 
        (SELECT id FROM gym WHERE gym_name = 'Actic Skogås'), 
        (SELECT id FROM user WHERE email = 'bibban@email.se')),
        
        ('Did not like!','Staff was on the phone the whole time (rude), and only two training bikes. Will not be back!', 1,
        (SELECT id FROM gym WHERE gym_name = 'Delta Gym'), 
        (SELECT id FROM user WHERE email = 'bibban@email.se')),
        
        ('Good gym for basic training, clean enough','This gym could do with some spray bottles to clean the bikes after use. Sweaty bikes are no fun! Good area for stretching though. Otherwise ok.', 3,
        (SELECT id FROM gym WHERE gym_name = 'Drivkraft'), 
        (SELECT id FROM user WHERE email = 'bibban@email.se')),
    
        ('Friendly staff!!','Got lots of great help from staff on how to use machines. Saw that there are lots of nice classes! I will be back for spinning!', 5,
        (SELECT id FROM gym WHERE gym_name = 'Hälsokällan'), 
        (SELECT id FROM user WHERE email = 'bibban@email.se')),
            
        ('Nice sauna','Nice sauna, and fresh showers. The training equipment was up to date, liked the warm-up area very much!', 5,
        (SELECT id FROM gym WHERE gym_name = 'Endorfin Lerum'), 
        (SELECT id FROM user WHERE email = 'clarreparre@email.se')),
    
        ('Meh','Zumba instructor was ok, I guess, but did not seem very experienced. Not super happy.', 1,
        (SELECT id FROM gym WHERE gym_name = 'Angered Arena'), 
        (SELECT id FROM user WHERE email = 'clarreparre@email.se')),
    
        ('Great yoga class!','Amazing yoga class! Loved the room, spacious and light! Will definitely be coming back for regular yoga classes! :)', 5,
        (SELECT id FROM gym WHERE gym_name = 'Hela Hälsan'), 
        (SELECT id FROM user WHERE email = 'clarreparre@email.se')), 
    
        ('Liked it, but want locks on lockers!','Definitely liked this gym. Great spinning class instructor! The changing rooms & showers were very clean! Only thing to complain about is no locks on lockers in changing room.', 4,
        (SELECT id FROM gym WHERE gym_name = 'Bulltofta Motionscenter'), 
        (SELECT id FROM user WHERE email = 'ducky@email.se')),
       
        ('Very nice gym, I will be back!','Good pilates room, fresh mats, very clean! Lovely gym.', 5,
        (SELECT id FROM gym WHERE gym_name = 'SHE'), 
        (SELECT id FROM user WHERE email = 'ducky@email.se')), 
        
        ('Ok, but smelly mats!','Very smelly mats, not very fresh. May try this gym again, but did not like my first visit. Otherwise ok.', 2,
        (SELECT id FROM gym WHERE gym_name = 'Kockum Fritid'), 
        (SELECT id FROM user WHERE email = 'ducky@email.se')) 
        ;`;

    await sequelize.query(reviewInsertQuery);

    console.log("Database successfully populated with data...");
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process
    process.exit(0);
  }
};

seedGymDb();
