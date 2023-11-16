import { IsNumber, Min, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  skip?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  orderBy?: string;
}

export class ParamsDto {
  @IsString()
  @Length(36, 36)
  id: string;
}

export type QueryParamsType = {
  filter?: any | null;
  order?: { field: string; order: 'DESC' | 'ASC' } | null;
  take?: number | null;
  skip?: number | null;
};

export const formatQueryParams = (params: any) => {
  const formatedParams: QueryParamsType = {};

  if (params.filter) {
    formatedParams.filter = JSON.parse(params.filter);
  }

  if (params.order) {
    formatedParams.order = JSON.parse(params.order);
  }

  if (params.take) {
    formatedParams.take = Number(params.take);
  }

  if (params.skip) {
    formatedParams.skip = Number(params.skip);
  }

  return formatedParams;
};

/// ColumnNumericTransformer
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}
