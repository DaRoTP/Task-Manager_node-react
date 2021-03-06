const Board = require("../../models/board");
const Tag = require("../../models/tag");

const tagService = {};

tagService.getBoardTags = async (req, res) => {
  const { boardId } = req.params;
  try {
    const { tags } = await Board.findOne({ _id: boardId }, "tags").populate("tags");
    return res.status(200).json({ tags });
  } catch (error) {
    next(error)
  }
};

tagService.createNewTag = async (req, res) => {
  const { boardId } = req.params;
  const { name, color } = req.body;
  try {
    const foundBoard = await Board.findOne({ _id: boardId }, "tags");

    const newTag = new Tag({ name, color });
    const saveTag = await newTag.save();
    foundBoard.tags.push(saveTag);
    await foundBoard.save();
    return res.status(200).json({ message: "created new tag", tag: saveTag });
  } catch (error) {
    next(error);
  }
};

tagService.deleteTag = async (req, res) => {
  const { boardId } = req.params;
  const { tagId } = req.params;
  try {
    await Tag.findOneAndDelete({ _id: tagId });
    await Board.findOneAndUpdate({ _id: boardId }, { $pull: { tags: tagId } });
    return res.status(200).json({ message: "tag deleted" });
  } catch (error) {
    next(error);
  }
};

tagService.updateTag = async (req, res) => {
  const { tagId } = req.params;
  const { name, color } = req.body;
  try {
    const updatedTag = await Tag.findOneAndUpdate({ _id: tagId }, { name, color });
    return res.status(200).json({ message: "tag updated", tag: updatedTag });
  } catch (error) {
    next(error);
  }
};

module.exports = tagService;
