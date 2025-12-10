"use server";

import Member from "@/models/member.model";
import { unstable_cache } from "next/cache";
import { CacheTags } from "@/lib/utils";
import { fiveMinutesInSeconds } from "@/lib/constants";
import { MemberType } from "@/types";

interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  typeFilter?: MemberType | "all";
}

export const getMembersAction = async ({
  page = 1,
  limit = 10,
  search = "",
  typeFilter = "all",
}: GetMembersParams = {}) => {
  try {
    const match: any = {};

    // TYPE FILTER
    if (typeFilter !== "all") {
      match.type = typeFilter;
    }

    // AGGREGATE PIPELINE
    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];

    // SEARCH
    if (search.trim()) {
      const regex = new RegExp(search, "i");

      match.$or = [{ "user.name": regex }, { "user.email": regex }];
    }

    // APPLY MATCH
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // COUNT
    const totalResult = await Member.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // PAGINATION + DATA
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const datas = await Member.aggregate(pipeline);

    return JSON.parse(
      JSON.stringify({
        success: true,
        datas,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return {
      success: false,
      datas: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      error: "Xodimlarni olishda xatolik",
    };
  }
};
