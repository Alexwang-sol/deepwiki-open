package main

import (
	"context"

	pb "git.huya.info/trpcprotocol/deepwiki/admin"
)

type ManagementServiceImpl struct {
}

// ListTasks retrieves a list of tasks
func (s *ManagementServiceImpl) ListTasks(
	ctx context.Context,
	req *pb.ListTasksRequest,
) (*pb.ListTasksResponse, error) {
	// return task.ListTasks(ctx, req)
	return nil, nil
}

// GetTaskDetail retrieves task details
func (s *ManagementServiceImpl) GetTaskDetail(
	ctx context.Context,
	req *pb.GetTaskDetailRequest,
) (*pb.GetTaskDetailResponse, error) {
	// return task.GetTaskDetail(ctx, req)
	return nil, nil
}
