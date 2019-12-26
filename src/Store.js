import LocalForage from './defaults/LocalForage';

class Store {
  async set(model, value) {
    const key = Object.keys(model.initialState)[0].toString();
    const engine = this.decideWhichEngine(model);

    try {
      await engine.set(key, value);

      const updatedValue = await engine.get(key);

      if(updatedValue === undefined) throw new Error(`Could not set ${key} = ${value}`);

      return { key, value };
    } catch (err) {
      console.log(err);
    }
  }

  /*
   * Decides whether it should use the plugin or default
   * Only here to make logic more readable since async/await makes it annoyingly hard to read
  */
  decideWhichEngine(model) {
    const hasOwnPlugin = model.plugins.storage;

    if(hasOwnPlugin) {
      return model.plugins.storage;
    }

    return LocalForage;
  }

  async setAll(units) {
    if (units === undefined || units.length === 0) {
      throw new Error('Array cannot be null or empty');
    }

    units.forEach(async kvPair => {
      try {
        await this.set(kvPair.key, kvPair.value);
      } catch (e) {
        console.log(e);
      }
    });

    return true;
  }

  async get(key) {
    if (!key) throw new Error('Must supply a key in get');

    try {
      const value = await localforage.getItem(key);

      return value == null ? null : JSON.parse(value);
    } catch (err) {
      console.log(`LocalForage getItem error: ${err}`);
    }
  }

  async clear() {
    try {
      await localforage.clear();
    } catch (err) {
      console.log(err);
    }
  }

  async remove(key) {
    if (!key) throw new Error('Must supply a key in remove');

    try {
      await localforage.removeItem(key);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Store();
