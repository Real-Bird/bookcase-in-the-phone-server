import mongoose from "mongoose";

const connect = () => {
  const mongooseOptions = {
    dbName: "BiP",
  };
  if (process.env.NODE_ENV !== "production") {
    mongooseOptions.dbName = "BiP_test";
    mongoose.set("debug", true);
  }

  mongoose.connect(process.env.MONGO_URI, mongooseOptions, (err) => {
    if (err) {
      console.log("몽고디비 연결 에러", err);
    } else {
      console.log("몽고디비 연결 성공");
    }
  });
  mongoose.set("strictQuery", false);

  mongoose.connection.on("error", (err) => {
    console.log("몽고디비 연결 에러", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
  });
};

export default connect;
