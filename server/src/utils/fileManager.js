const fs = require("fs");
const path = require("path");

class File {
  constructor(name) {
    this.name = path.join(__dirname, '../database', `${name}` );
    
    try {
      this.content = fs.readFileSync(this.name, 'utf-8');
      this.content = JSON.parse(this.content);
    } catch (error) {
      console.log(error);
      this.content = [];
      fs.promises.writeFile(this.name, JSON.stringify(this.content, null, '\t'))
    };
  };
  
  async getAll() {
    console.log("get all", this.content);
    return this.content;
  };

  async save(object) {
    try {
      if (this.content.length == 0) {
        object.id = 1
      } else {
        object.id = this.content.length + 1
      }
      this.content.push(object);
      fs.promises.writeFile(this.name, JSON.stringify(this.content, null, '\t'))
        .then(() => {
          console.log('Object Saved')
        })
        .catch(e => console.log(e))
      return ({ response: 'Saved', object })
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to add object!`)
    };
  };

  async getById(id) {
    try {
      const content = await this.getAll();
      let foundElement = content.find((item) => item.id === Number(id));
      return foundElement;
    } catch (error) {
      console.log(error);
      throw new Error(`Couldn't find ${id} object! ${error}`);
    };
  };

  #updateContent(content) {
    this.content = content;
  }

  async updateItem(item) {
    try {
      console.log("update", item);
      const content = await this.getAll();
      const index = content.findIndex(e => e.id == item.id)
      if (index < 0) {
        console.error(`updateItem: item ${item.id} not found`)
        return;
      }
			const newElement = {...content[index], ...item}
			content[index] = newElement;
      this.#updateContent(content)

      try {
        fs.writeFileSync(this.name, JSON.stringify(content, null, '\t'))
      } catch (error) {
        console.log(error);
      }

			return ({ response: "Updated", element: newElement })
		} catch (error) {
			console.log(error)
			return ({ response: Error `updating ${newElement}`, error })
		}
  }

  async deleteById(id) {
    const content = await this.getAll();
    const toDelete = content.filter((item) => item.id !== Number(id));
    try {
      await fs.promises.writeFile(
        this.name,
        JSON.stringify(toDelete, null, 4)
      );
      this.#updateContent(toDelete);
      console.log(`item ${id} deleted!`);
    } catch (error) {
      console.log(`item ${id} couldn't be deleted: ${error}`);
    };
  };

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([]));
      console.log(`All products deleted!`);
    } catch (error) {
      throw new Error(`Error deleting all products: ${error}`);
    };
  };
};

module.exports = File;
