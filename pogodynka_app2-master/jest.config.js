module.exports = {
    "roots": [
      "<rootDir>/"
    ],
    "testMatch": [
      "<rootDir>/test/**/*.(test).{js,jsx,ts,tsx}",
      "<rootDir>/test/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
      "window": {}
    },
    "setupFiles": ["<rootDir>/test/localStorageMock.js"],
    "moduleNameMapper": {
      "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    }
  }