exports.up = (pgm) => {
  pgm.sql(
    `
    ALTER 
      TABLE users
    ADD 
      CONSTRAINT 
     users_username_unique 
      UNIQUE (username)
     ;
     `,
  );
};

exports.down = false;
