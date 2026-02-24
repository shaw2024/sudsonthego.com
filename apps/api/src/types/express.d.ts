declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: "CUSTOMER" | "WASHER";
      name?: string;
      phone?: string;
    };
  }
}

export {};