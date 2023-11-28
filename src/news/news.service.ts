import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, News } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { UpdateManyStatus, UpdateStatus } from './dto/update-status.dto';
import { ImageUpload } from './dto/image-upload.dto';



@Injectable()
export class NewsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createNewsDto: CreateNewsDto, imageData: ImageUpload, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const isExists = await this.databaseService.news.findFirst({
        where: {
          slug: {
            equals: createNewsDto.slug
          }
        }
      });

      if (isExists) return new CustomResponse(false, "A News already exists with the slug.", { newsId: isExists.id, slug: isExists.slug });

      // Create the news article
      let uniqueTags = [];

      if (createNewsDto.tags?.length > 0) {
        uniqueTags = createNewsDto.tags.filter(
          (tag, index, self) =>
            index === self.findIndex((t) => t.name.toLowerCase() === tag.name.toLowerCase())
        );
      }


      await this.databaseService.news.create({
        data: {
          title: createNewsDto.title,
          slug: createNewsDto.slug,
          shortDesc: createNewsDto.shortDesc,
          description: createNewsDto.description,
          featuredImage: imageData.featuredImage,
          imgSourceUrl: createNewsDto.imgSourceUrl,
          originalNewsUrl: createNewsDto.originalNewsUrl,
          newsSource: createNewsDto.newsSource || 'local',
          status: createNewsDto.status || 'draft',
          authors: createNewsDto.authors,
          category: {
            connect: {
              id: Number(createNewsDto.catId),
            },
          },
          addedBy: {
            connect: {
              id: reqUser.id,
            },
          },
          tags: {
            createMany: {
              skipDuplicates: true,
              data: uniqueTags
            }
          },
          images: {
            createMany: {
              data: imageData.galleryImages
            }
          }
        },
      });



      return new CustomResponse(true, `News Successfully ${createNewsDto.status}.`, {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findAll(page: number, limit: number, query: string, category?: number) {
    try {
      const skip = (page - 1) * limit;

      let whereQuery: Prisma.NewsWhereInput = { category: { id: category } };

      if (query) {
        whereQuery = {
          OR: [
            { title: { contains: query } },
            { slug: { contains: query } }
          ]
        };
      }

      const totalRecord = await this.databaseService.news.count({
        where: whereQuery
      });

      if (!totalRecord) return new CustomResponse(false, "News Not Found.", {});


      const response = await this.databaseService.news.findMany({
        where: whereQuery,
        include: {
          addedBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
          category: { select: { id: true, name: true } },
          tags: { select: { id: true, name: true } },
        },
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<News[]>(true, "News List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Public 
  async findAllPublic(page: number, limit: number, query: string, tag?: string, category?: number) {
    try {
      const skip = (page - 1) * limit;

      let whereQuery: Prisma.NewsWhereInput = { category: { id: category }, status: 'published' };

      if (tag) {
        whereQuery = {
          tags: {
            some: { name: { contains: tag } }
          }
        };
      }

      if (query) {
        if (tag) {
          whereQuery = {
            OR: [
              { title: { contains: query } },
              { slug: { contains: query } }
            ],
            tags: {
              some: { name: { contains: tag } }
            }
          };
        } else {
          whereQuery = {
            OR: [
              { title: { contains: query } },
              { slug: { contains: query } }
            ]
          };
        }
      }

      const totalRecord = await this.databaseService.news.count({
        where: whereQuery
      });

      if (!totalRecord) return new CustomResponse(false, "News Not Found.", {});


      const response = await this.databaseService.news.findMany({
        where: whereQuery,
        include: {
          category: { select: { id: true, name: true } },
          tags: { select: { id: true, name: true } },
          images: { select: { id: true, image: true } },
          comments: true
        },
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<News[]>(true, "News List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async findOne(id: number) {
    try {
      const response = await this.databaseService.news.findUnique({
        where: {
          id
        },
        include: {
          addedBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
          category: { select: { id: true, name: true } },
          tags: { select: { id: true, name: true } },
          comments: true,
          images: { select: { image: true } }
        },
      });

      if (!response) return new CustomResponse(false, "News Not Found.", {});

      return new CustomResponse<News>(true, "News Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Public 
  async findOnePublic(id: number) {
    try {
      const response = await this.databaseService.news.findUnique({
        where: {
          id,
          status: 'published'
        },
        include: {
          category: { select: { id: true, name: true } },
          tags: { select: { id: true, name: true } },
          images: { select: { image: true } },
          comments: true,
        },
      });

      if (!response) return new CustomResponse(false, "News Not Found.", {});

      return new CustomResponse<News>(true, "News Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto, imageData: ImageUpload, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const isExists = await this.databaseService.news.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "News Not Found.", {});

      const isSlugExists = await this.databaseService.news.findFirst({
        where: {
          slug: updateNewsDto.slug
        }
      });

      if (isSlugExists) return new CustomResponse(false, "News Slug should be unique.", {});

      // Now updating the News
      let uniqueTags = [];
      if (updateNewsDto.tags?.length > 0) {
        uniqueTags = updateNewsDto.tags.filter(
          (tag, index, self) =>
            index ===
            self.findIndex((t) => t.name.toLowerCase() === tag.name.toLowerCase())
        );
      }

      const response = await this.databaseService.news.update({
        where: {
          id
        },
        data: {
          title: updateNewsDto.title,
          slug: updateNewsDto.slug,
          shortDesc: updateNewsDto.shortDesc,
          description: updateNewsDto.description,
          featuredImage: imageData.featuredImage,
          imgSourceUrl: updateNewsDto.imgSourceUrl,
          originalNewsUrl: updateNewsDto.originalNewsUrl,
          newsSource: updateNewsDto.newsSource,
          status: updateNewsDto.status,
          authors: updateNewsDto.authors,
          category: {
            connect: {
              id: Number(updateNewsDto.catId),
            },
          },
          updatedBy: {
            connect: {
              id: reqUser.id,
            },
          },
          tags: {
            deleteMany: {
              newsId: id
            },
            createMany: {
              skipDuplicates: true,
              data: uniqueTags
            }
          },
          images: {
            deleteMany: {
              newsId: id
            },
            createMany: {
              skipDuplicates: true,
              data: imageData.galleryImages
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "News Not Found.", {});

      return new CustomResponse(true, "News Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async statusUpdateAll(updateManyStatus: UpdateManyStatus, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const idsToUpdate: number[] = updateManyStatus.newsIds.map(item => item.id);

      await this.databaseService.news.updateMany({
        where: {
          id: { in: idsToUpdate },
        },
        data: {
          status: updateManyStatus.status,
          updatedById: reqUser?.id,
        },
      });


      return new CustomResponse(true, "News Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async statusUpdateOne(id: number, updateStatus: UpdateStatus, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const isExists = await this.databaseService.news.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "News Not Found.", {});

      await this.databaseService.news.update({
        where: {
          id
        },
        data: {
          status: updateStatus.status,
          updatedById: reqUser.id
        }
      });


      return new CustomResponse(true, "News Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async updateNewsStat(id: number, stat: 'share' | 'views') {
    try {
      const isExists = await this.databaseService.news.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "News Not Found.", {});


      if (stat === "share") {
        await this.databaseService.news.update({
          where: {
            id
          },
          data: {
            shareCount: { increment: 1 }
          }
        });

      } else {
        await this.databaseService.news.update({
          where: {
            id
          },
          data: {
            viewCount: { increment: 1 }
          }
        });
      }


      return new CustomResponse(true, "News Stat Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async remove(id: number) {
    try {
      const isExists = await this.databaseService.news.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "News Not Found.", {});

      const response = await this.databaseService.news.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "News Not Found.", {});

      return new CustomResponse(true, "News Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
