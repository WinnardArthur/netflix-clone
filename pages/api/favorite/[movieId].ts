import prismadb from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth";
import { without } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req, res);

      const { movieId } = req.query;

      if (typeof movieId !== "string") {
        throw new Error("Invalid ID");
      }

      if (!movieId) {
        throw new Error("Invalid ID");
      }

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
