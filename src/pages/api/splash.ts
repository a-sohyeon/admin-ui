// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TABLE_DATA from "@/consts/TableData";
import type { NextApiRequest, NextApiResponse } from "next";

let data = [...TABLE_DATA];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const _req = req.body ? JSON.parse(req.body) : null;
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
      res.status(200).json([...data, req.body]);
      break;
    case "PUT":
      if (_req.id && _req.data) {
        console.log(_req.data?.status);

        data = data.map((item) =>
          item.id === _req.id
            ? {
                ...item,
                status:
                  _req.data?.status !== undefined
                    ? _req.data?.status
                    : item.status,
                amount:
                  _req.data?.amount !== undefined
                    ? _req.data?.amount
                    : item.amount,
                email:
                  _req.data?.email !== undefined
                    ? _req.data?.email
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
      if (_req.id) {
        data = data.filter((item) => item.id !== _req.id);
        res.status(200).json({ data, success: true });
      } else {
        res.status(400).json({ error: "Invalid request" });
      }
      break;
    default:
      res.status(405).end();
  }
}
