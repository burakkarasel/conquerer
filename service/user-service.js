const userRepository = require("../database/user-repository");

class UserService {
  userRepository;
  constructor(_userRepository) {
    this.userRepository = _userRepository;
  }

  getUserDetails = (userId) => {
    return this.userRepository.getUserDetails(userId);
  };

  updateUserDetails = async (userId, fullName, username, dob) => {
    const previousUser = await this.userRepository.getUserDetails(userId);

    const newFullName = fullName || previousUser.full_name;
    const newUsername = username || previousUser.user_name;
    const newDob = dob || previousUser.dob;

    return this.userRepository.updateUserDetails(
      userId,
      newFullName,
      newUsername,
      newDob
    );
  };

  deleteUser = (userId) => {
    return this.userRepository.deleteUser(userId);
  };
}

module.exports = new UserService(userRepository);
