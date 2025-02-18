<?php

namespace App\Services;

use App\Models\News;

class NewsService
{
    public function getAll()
    {
        return News::all();
    }

    public function getById($id)
    {
        return News::findOrFail($id);
    }

    public function create(array $data)
    {
        return News::create($data);
    }

    public function update($id, array $data)
    {
        $news = News::findOrFail($id);
        $news->update($data);
        return $news;
    }

    public function delete($id)
    {
        $news = News::findOrFail($id);
        return $news->delete();
    }
} 