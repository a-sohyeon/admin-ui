// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TABLE_DATA from "@/consts/TableData";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    externalResolver: true,
  },
};

let data = [...TABLE_DATA];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const _req = req.body ? JSON.parse(req.body) : null;
  const query = req.query;
  let filteredData = [...data];

  switch (req.method) {
    case "GET":
      switch (query.category) {
        case "email":
          filteredData = filteredData.filter((item) => {
            if (
              item.email.toLocaleLowerCase().includes(query.keyword as string)
            ) {
              return true;
            }
            return false;
          });
          break;
        case "name":
          filteredData = filteredData.filter((item) => {
            if (
              item.name.toLocaleLowerCase().includes(query.keyword as string)
            ) {
              return item;
            }
            return false;
          });
          break;
        default:
          break;
      }

      if (query.status === "active") {
        filteredData = filteredData.filter((item) => item.status === true);
      }
      if (query.status === "inactive") {
        filteredData = filteredData.filter((item) => item.status === false);
      }

      res.status(200).json(filteredData);
      break;
    case "POST":
      data = [req.body.data, ...data];
      res.status(200).json({ data, success: true });
      break;
    case "PUT":
      if (req.body.id && req.body.data) {
        console.log(req.body.data?.status);

        data = data.map((item) =>
          item.id === req.body.id
            ? {
                ...item,
                status:
                  req.body.data?.status !== undefined
                    ? req.body.data?.status
                    : item.status,
                amount:
                  req.body.data?.amount !== undefined
                    ? req.body.data?.amount
                    : item.amount,
                email:
                  req.body.data?.email !== undefined
                    ? req.body.data?.email
                    : item.email,
              }
            : item
        );

        res.status(200).json({
          data,
          success: true,
        });
      } else {
        res.status(400).json({ error: "Invalid request" });
      }
      break;
    case "DELETE":
      if (req.body.id.length > 0) {
        data = data.filter((item) => !req.body.id.includes(item.id));
        const time = 1000 + Math.random() * 5000;
        setTimeout(() => {
          res.status(200).json({ data, success: true });
        }, time);
      } else {
        res.status(400).json({ error: "Invalid request" });
      }
      break;
    default:
      res.status(405).end();
  }
}
