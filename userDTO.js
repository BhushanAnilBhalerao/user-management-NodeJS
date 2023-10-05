class UserDTO {
    constructor(id, name, username, password) {
        if (typeof id !== 'number') {
            throw new Error('ID must be a number');
        }
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        if (typeof username !== 'string') {
            throw new Error('Username must be a string');
        }
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }

        if (name.trim() === '') {
            throw new Error('Name cannot be empty');
        }
        if (username.trim() === '') {
            throw new Error('Username cannot be empty');
        }
        if (password.trim() === '') {
            throw new Error('Password cannot be empty');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
    }
}

module.exports = UserDTO;