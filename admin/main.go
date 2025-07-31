package main

import (
	trpc "git.huya.com/trpcgo/trpc-go"
	"git.huya.com/trpcgo/trpc-go/log"
	pb "git.huya.info/trpcprotocol/deepwiki/admin"

	_ "git.huya.com/trpcgo/trpc-config-apollo"
	_ "git.huya.com/trpcgo/trpc-filter/debuglog"
	_ "git.huya.com/trpcgo/trpc-filter/recovery"
	_ "git.huya.com/trpcgo/trpc-go/naming/selector"
	_ "git.huya.com/trpcgo/trpc-naming-polaris"
	_ "git.huya.com/trpcgo/trpc-naming-polaris/registry"
	_ "git.huya.com/trpcgo/trpc-selector-dsn"
	_ "git.huya.com/trpcgo/trpc-tracing-xiwi"
)

func main() {
	s := trpc.NewServer()
	pb.RegisterManagementService(s, &ManagementServiceImpl{})
	if err := s.Serve(); err != nil {
		log.Fatal(err)
	}
}
