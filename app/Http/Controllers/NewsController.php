<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsRequest;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(): JsonResponse
    {
        $news = $this->newsService->getAll();
        return response()->json($news);
    }

    public function show($id): JsonResponse
    {
        $news = $this->newsService->getById($id);
        return response()->json($news);
    }

    public function store(NewsRequest $request): JsonResponse
    {
        $news = $this->newsService->create($request->validated());
        return response()->json($news, 201);
    }

    public function update(NewsRequest $request, $id): JsonResponse
    {
        $news = $this->newsService->update($id, $request->validated());
        return response()->json($news);
    }

    public function destroy($id): JsonResponse
    {
        $this->newsService->delete($id);
        return response()->json(null, 204);
    }
}