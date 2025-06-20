import express from "express";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/todos", authenticate, async (req, res, next) => {
  const { todoId } = req.body;
  const post = await prisma.post.findUnique({
    where: { todoId: +todoId },
    include: {
      User: {
        select: {
          todoId: true,
          title: true,
          description: true,
          isCompleted: false,
        },
      },
    },
  });
  return res.status(200).json({ data: post });
});

router.post("/todos", authenticate, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        userId: req.user.userId,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "리스트 추가 실패" });
  }
});

router.put("/todos/:id", authenticate, async (req, res) => {
  const todoId = Number(req.params.id);
  const { title, description } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { todoId } });
    if (!post) return res.status(404).json({ message: "게시글 없음" });
    if (post.userId !== req.user.userId)
      return res.status(403).json({ message: "수정 권한 없음" });

    const updated = await prisma.post.update({
      where: { todoId },
      data: { title, description },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "리스트 수정 실패" });
  }
});

router.delete("/todos/:id", authenticate, async (req, res) => {
  const todoId = Number(req.params.id);

  try {
    const post = await prisma.post.findUnique({ where: { todoId } });
    if (!post) return res.status(404).json({ message: "게시글 없음" });
    if (post.userId !== req.user.userId)
      return res.status(403).json({ message: "삭제 권한 없음" });

    await prisma.post.delete({ where: { todoId } });
    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "리스트 삭제 실패" });
  }
});

export default router;
