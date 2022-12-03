import data from "@/data/bebop.json";
import { z } from "zod";

const useClude = (shape: z.ZodRawShape) => {
  const schema = z.object(shape);

  type Shape = z.infer<typeof schema>;

  type ShapeKeys = keyof Shape;

  const exclude = (...props: ShapeKeys[]) => {
    return schema.transform((res) => {
      const items = Object.keys(res) as ShapeKeys[];
      return items
        .filter((item) => {
          return !props.includes(item);
        })
        .reduce((acc, cur) => {
          return { ...acc, [cur]: res[cur] };
        }, {});
    });
  };

  const include = (...props: ShapeKeys[]) => {
    return schema.transform((res) => {
      const items = Object.keys(res) as ShapeKeys[];
      return items
        .filter((item) => {
          return props.includes(item);
        })
        .reduce((acc, cur) => {
          return { ...acc, [cur]: res[cur] };
        }, {});
    });
  };

  return {
    exclude,
    include,
  };
};
const userShape: z.ZodRawShape = {
  id: z.string(),
  name: z.string(),
  age: z.number(),
  blogs: z
    .object({
      id: z.string(),
      title: z.string(),
    })
    .array(),
};
const { exclude, include } = useClude(userShape);
console.log(JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    data.map((item) => include("blogs").parse(item)),
    null,
    2
  )
);
console.log(
  JSON.stringify(
    data.map((item) => exclude("name", "age").parse(item)),
    null,
    2
  )
);
