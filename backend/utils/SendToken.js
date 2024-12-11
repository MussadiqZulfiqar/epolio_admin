const SendToken = (res, status, user) => {
  try {
    const token = user.getJwtToken();
    const options = {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    };
    res.cookie("user_token", token, options).status(status).json({
      success: true,
      message: "Success",
      user,
      token,
    });
  } catch (error) {
    console.log("Error sending reports Tpken!!");
  }
};
module.exports = SendToken;
