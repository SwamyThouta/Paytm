import { Login } from "../../types";

const url = process.env.NEXT_PUBLIC_API_BASE_URL;
const header = {
  Accept: "application/json",
  "Content-type": "application/json",
  Authorization:
    "Basic ZXJwMVZMbngzVDVtdWltYXBtZFNRVVozR1cxUHNWUXFiMzo4QnhDclNnaTdBN0Y1YW5qYXNNZ0hzaDhhbnhRcXhLaDEx",
};

const login = async (data: Login): Promise<any> => {
  console.log("ddddddddddddddddd", data);
  const options = {
    headers: header,
    method: "POST",
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(
      `http://192.168.110.46:4200/admin/login`,
      options
    );
    const res = await response.json();
    console.log("resssssssssssssssssssss", res);
    if (res.token) {
      return res;
    }
    throw new Error(res.message || "Login failed");
  } catch (error: any) {
    console.log("errrrrrrrrrrrrrrrrrrrrrr", error.stack);
    throw new Error(
      error.message || "Something went wrong, please try again later"
    );
  }
};

const forgotPassword = async (data: {}): Promise<{}> => {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic ZXJwMVZMbngzVDVtdWltYXBtZFNRVVozR1cxUHNWUXFiMzo4QnhDclNnaTdBN0Y1YW5qYXNNZ0hzaDhhbnhRcXhLaDEx",
    },
    method: "POST",
    body: JSON.stringify(data),
  };

  return fetch(`http://192.168.110.46:4200/admin/forgot-password`, options)
    .then(async (res) => {
      if (res.status === 404) {
        const errorJson = await res.json();
        return { error: errorJson };
      } else {
        return res.json();
      }
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};

const verifyOtp = async (data: {}): Promise<{}> => {
  return { response: true };
};

const updatePassword = async (data: {}): Promise<{}> => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    method: "POST",
    body: JSON.stringify(data),
  };
  console.log(options.headers.Authorization);
  return fetch(`http://192.168.110.46:4200/admin/reset-password`, options)
    .then(async (res) => {
      console.log("res", res);
      if (res.status === 400) {
        const errorJson = await res.json();
        return { error: errorJson };
      } else {
        return res.json();
      }
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};

export { login, forgotPassword, verifyOtp, updatePassword };
