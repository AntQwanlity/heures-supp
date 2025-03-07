const productionSingletons: Map<string, any> = new Map();

export const getSingleton = async <T>(name: string, create: () => Promise<T>): Promise<T> => {
  let singleton = productionSingletons.get(name);
  if (!singleton) {
    singleton = await create();
    productionSingletons.set(name, singleton);
  }

  return singleton;
};
